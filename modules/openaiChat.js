const { PermissionsBitField } = require("discord.js");
require("dotenv").config();
const options = require("../options.json");
const {
  OpenAIChatModel,
  liveShows,
  userPrompts,
  moderatorPrompt,
  boosterPrompt,
} = options.modules.openaiChat;
const { OpenAI } = require("openai"); // Correct import
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY }); // Correct initialization
const { DateTime } = require("luxon"); // Import Luxon for timezone handling

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
  const botName = message.client.user.username; // Get the bot's name
  const botMessageHistory = [];
  const allMessageHistory = await message.channel.messages.fetch({ limit: 40 });
  for (const item of allMessageHistory) {
    const msg = item[1];
    if (await isMessageToOrFromBot(msg, botId)) {
      let thisMsgContent = [
        {
          type: "text",
          text: msg.content.replaceAll(`<@${botId}>`, botName), // Replace bot mentions with bot name
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

      botMessageHistory.unshift({
        role: msg.author.id === botId ? "assistant" : "user",
        name: sanitizeName(msg.member?.displayName || "Unknown"),
        content: thisMsgContent,
      });
    }
  }

  // Truncate conversationLog to avoid exceeding token limits
  const maxLogTokens = 4096 - 1024; // Reserve 1024 tokens for the response
  let totalTokens = 0;
  const filteredBotMessageHistory = [];
  for (const entry of botMessageHistory.reverse()) {
    const entryTokens = entry.content.length / 4; // Approximation: 1 token ≈ 4 characters
    if (totalTokens + entryTokens > maxLogTokens) break;
    filteredBotMessageHistory.unshift(entry);
    totalTokens += entryTokens;
  }

  if (message.reference) {
    try {
      const referencedMessage = await message.fetchReference();
      if (referencedMessage) {
        // Remove the referenced message if it already exists in the conversationLog
        const existingIndex = filteredBotMessageHistory.findIndex(
          (entry) =>
            entry.content === referencedMessage.content &&
            entry.name ===
              sanitizeName(referencedMessage.member?.displayName || "Unknown")
        );
        if (existingIndex !== -1) {
          filteredBotMessageHistory.splice(existingIndex, 1); // Remove the existing entry
        }

        // Add the referenced message as the last entry before the user's response
        filteredBotMessageHistory.push({
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
  let thisUserPrompt = `You are speaking with a Discord user who goes by the handle ${message.member.displayName}.`;
  if (userPrompts[message.member.id]) {
    thisUserPrompt += ` ${userPrompts[message.member.id].prompt}`;
  } else if (
    message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    thisUserPrompt += ` ${moderatorPrompt}`;
  } else if (
    message.member.premiumSince &&
    !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    thisUserPrompt += ` ${boosterPrompt}`;
  }
  filteredBotMessageHistory.unshift({
    role: "system",
    content: thisUserPrompt,
  });

  // Add prompts for context-specific information
  if (message.content.toLowerCase().includes("first shift")) {
    // Convert to lowercase for case-insensitive match
    filteredBotMessageHistory.unshift({
      role: "system",
      content: `On Patrol First Shift is a program that airs for one hour prior to the start of On Patrol Live. The first 6 minutes of the show includes a live in-studio segment with the hosts and sometimes guests following up on events from recent episodes. The remaining 54 minutes of First Shift are just clips from previously aired episodes, and no live content.`,
    });
  }

  // Add prompts for live show information
  if (liveShows.length > 0) {
    const upcomingShows = liveShows
      .map(
        (show) =>
          `${show.episode} on ${new Date(show.showtime).toLocaleString()}.`
      ) // Format each showtime
      .join(", ");
    if (upcomingShows) {
      filteredBotMessageHistory.unshift({
        role: "system",
        content: `Upcoming and recent live shows: ${upcomingShows}`,
      });
    }
  }

  // Add system prompts

  // Get the current time in Eastern Time (EST)
  const currentTimeEST = DateTime.now()
    .setZone("America/New_York")
    .toLocaleString(DateTime.DATETIME_FULL);

    filteredBotMessageHistory.unshift({
    role: "system",
    content: `Today is ${currentTimeEST}.`, // Dynamically include the current date and time in EST
  });

  filteredBotMessageHistory.unshift({
    role: "system",
    content: `This conversation takes place on the Discord server for fans of the show "On Patrol Live" which airs on Fridays and Saturdays from 9 PM to 12 AM ET. You are familiar with the show's schedule, hosts, departments, and general format. If a question is about the show, answer with accurate and helpful information. If you're not sure about something, say you don't know. For current show related news, direct the user to the #announcements channel.`,
  });
  filteredBotMessageHistory.unshift({
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
      messages: filteredBotMessageHistory,
      max_tokens: 1024, // limit token usage (length of response)
    };
  } else {
    apiPackage = {
      model: OpenAIChatModel,
      messages: filteredBotMessageHistory,
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
