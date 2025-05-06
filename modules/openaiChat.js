const { PermissionsBitField } = require("discord.js");
require("dotenv").config();
const options = require("../options.json");
const { OpenAIChatModel } = options;
const { OpenAI } = require("openai"); // Correct import
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY }); // Correct initialization

async function isMessageToOrFromBot(message, botId) {
  try {
    if (message.mentions.has(botId) || message.author.id === botId) {
      return true;
    }
    if (message.reference) {
      const repliedMessage = await message.fetchReference();
      return repliedMessage.author.id === botId;
    }
  } catch (error) {
    console.error("Error checking message reference:", error);
  }
  return false;
}

function sanitizeName(name) {
  // Remove invalid characters and replace spaces with underscores
  return name.replace(/[^\w-]/g, "_");
}

module.exports = async function (message) {
  await message.channel.sendTyping();
  const botId = message.client.user.id;
  let regexIds = /(<@1041050338775539732>|<@&1045554081848103007>)/gim;
  const conversationLog = [];

  const prevMessages = await message.channel.messages.fetch({ limit: 40 });
  for (const item of prevMessages) {
    const msg = item[1];
    if (await isMessageToOrFromBot(msg, botId)) {
      let thisMsgContent = [
        {
          type: "text",
          text: msg.content.replace(regexIds, "OPie"),
        },
      ];

      // check for images in the message
      if (msg.attachments.size > 0) {
        msg.attachments.forEach((attachment) => {
          if (attachment.contentType.startsWith("image/")) {
            thisMsgContent.push({
              type: "image_url",
              image_url: {
                url: attachment.url,
              },
            });
          }
        });
      }

      conversationLog.unshift({
        role: msg.author.id === botId ? "assistant" : "user",
        name: sanitizeName(msg.member?.displayName || "Unknown"),
        content: thisMsgContent,
      });
    }
  }

  // Truncate conversationLog to avoid exceeding token limits
  const maxLogTokens = 4096 - 1024; // Reserve 1024 tokens for the response
  let totalTokens = 0;
  const truncatedLog = [];
  for (const entry of conversationLog.reverse()) {
    const entryTokens = entry.content.length / 4; // Approximation: 1 token ≈ 4 characters
    if (totalTokens + entryTokens > maxLogTokens) break;
    truncatedLog.unshift(entry);
    totalTokens += entryTokens;
  }

  if (message.reference) {
    try {
      const referencedMessage = await message.fetchReference();
      if (referencedMessage) {
        // Remove the referenced message if it already exists in the conversationLog
        const existingIndex = truncatedLog.findIndex(
          (entry) =>
            entry.content === referencedMessage.content &&
            entry.name ===
              sanitizeName(referencedMessage.member?.displayName || "Unknown")
        );
        if (existingIndex !== -1) {
          truncatedLog.splice(existingIndex, 1); // Remove the existing entry
        }

        // Add the referenced message as the last entry before the user's response
        truncatedLog.push({
          role: referencedMessage.author.id === botId ? "assistant" : "user",
          name: sanitizeName(
            referencedMessage.member?.displayName || "Unknown"
          ),
          content: `The user is replying to this message: "${referencedMessage.content}"`,
        });
      }
    } catch (error) {
      console.error("Error fetching referenced message:", error);
    }
  }

  // Add user-specific prompts
  if (message.member.id === "629681401918390312") {
    // Barre
    truncatedLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She is the owner of this server and is held in the highest regard. You sometimes refer to her as "highness", "queen", "SWMBO", etc.`,
    });
  } else if (message.member.id == "348629137080057878") {
    // Bwana
    truncatedLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. He is the resident I.T. nerd and the one who programmed you.`,
    });
  } else if (
    message.member.id == "511074631239598080" ||
    message.member.id == "1358747746395361280"
  ) {
    // Ferret
    truncatedLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She is an adorable ferret that we all love and a valued moderator here. She has a playful and mischievous side, sometimes swiping small household items like socks, but she also enjoys interacting with the community in fun and engaging ways. Occasionally, she needs a bath to keep her in check.`,
    });
  } else if (message.member.id == "1250263798070247487") {
    // Chibi
    truncatedLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She is a lovely small chibi. By day, she makes beautiful flower arrangements. By night, she's one of our beloved moderators.`,
    });
  } else if (message.member.id == "303930225945870336") {
    // Kavzilla
    truncatedLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She assumes the persona of a bearded dragon and loves and keeps lizards, frogs, etc. She also works in I.T. and is one of our moderators here.`,
    });
  } else if (message.member.id == "440328038337478657") {
    // Saucy
    truncatedLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. He assumes the persona of a sausage and is a moderator here who also umpires baseball games and moderates our subreddit.`,
    });
  } else if (
    message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    truncatedLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. They are a moderator of our Discord community.`,
    });
  } else if (
    message.member.premiumSince &&
    !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    truncatedLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. They have boosted the server which means they have paid money to support our community and are a highly regarded community member`,
    });
  } else {
    truncatedLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}.`,
    });
  }

  // add prompts for context specific information
  if (message.content.includes("first shift")) {
    truncatedLog.unshift({
      role: "system",
      content: `On Patrol First Shift is a program that airs for one hour prior to the start of On Patrol Live. The first 6 minutes of the show includes a live in-studio segment with the hosts and sometimes guests following up on events from recent episodes. The remaining 54 minutes of First Shift are just clips from previously aired episodes, and no live content.`,
    });
  }

  // Add system prompts
  if (options.liveShows.length > 0) {
    const upcomingShows = options.liveShows
      .filter((show) => new Date(show.showtime) > new Date()) // Filter future showtimes
      .map(
        (show) =>
          `${show.episode} on ${new Date(
            show.showtime
          ).toLocaleString()}.`
      ) // Format each showtime
      .join(", ");
    if (upcomingShows) {
      truncatedLog.unshift({
        role: "system",
        content: `Upcoming live shows: ${upcomingShows}`,
      });
    }
  }

  truncatedLog.unshift({
    role: "system",
    content: `Today is ${new Date().toLocaleString()}.`, // Dynamically include the current date and time
  });

  truncatedLog.unshift({
    role: "system",
    content: `This conversation takes place on the Discord server for fans of the show "On Patrol Live" which airs on Fridays and Saturdays from 9 PM to 12 AM ET. You are familiar with the show's schedule, hosts, departments, and general format. If a question is about the show, answer with accurate and helpful information. If you're not sure about something, say you don't know. For current show related info, direct the user to the #announcements channel.`,
  });
  truncatedLog.unshift({
    role: "system",
    content: `Respond like an affable, charismatic Discord chatbot kitten named OPie that exudes charm, wit, and friendliness`,
  });

  let apiPackage = {};
  // if mod or tech channel don't restrict response size
  if (
    message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) ||
    message.channel.id == "1250589626717175910" ||
    message.channel.id == "1119367030823473303" ||
    message.channel.id == "366531564693356554" ||
    message.channel.id == "1079220872973406319"
  ) {
    apiPackage = {
      model: OpenAIChatModel,
      messages: truncatedLog,
      max_tokens: 1024, // limit token usage (length of response)
    };
  } else {
    apiPackage = {
      model: OpenAIChatModel,
      messages: truncatedLog,
      max_tokens: 256, // limit token usage (length of response)
    };
  }

  // console.log(apiPackage);

  try {
    const result = await openai.chat.completions.create(apiPackage); // Correct method
    if (result && result.choices && result.choices[0]) {
      return result.choices[0].message.content; // Adjusted response structure
    } else {
      return "ERR";
    }
  } catch (error) {
    const errorDetails =
      error.response?.data || error.message || error.toString();
    console.error(`⛔ [Error] OPENAI:`, JSON.stringify(errorDetails, null, 2));
    return "ERR";
  }
};
