const { PermissionsBitField } = require("discord.js");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

  const prevMessages = await message.channel.messages.fetch({ limit: 50 });
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

  if (message.member.id === "629681401918390312") {
    // Barre
    conversationLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She is the owner of this server and is held in the highest regard. You sometimes refer to her as "highness", "queen", "SWMBO", etc.`,
    });
  } else if (message.member.id == "348629137080057878") {
    // Bwana
    conversationLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. He is the resident I.T. nerd and your daddy.`,
    });
  } else if (
    message.member.id == "511074631239598080" ||
    message.member.id == "1358747746395361280"
  ) {
    // Ferret
    conversationLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She is an adorable ferret that we all love and a valued moderator here. She has a playful and mischievous side, sometimes swiping small household items like socks, but she also enjoys interacting with the community in fun and engaging ways. Occasionally, she needs a bath to keep her in check.`,
    });
  } else if (message.member.id == "1250263798070247487") {
    // Chibi
    conversationLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She is a lovely small chibi. By day, she makes beautiful flower arrangements. By night, she's one of our beloved moderators.`,
    });
  } else if (message.member.id == "303930225945870336") {
    // Kavzilla
    conversationLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She assumes the persona of a bearded dragon and loves and keeps lizards, frogs, etc. She also works in I.T. and is one of our moderators here.`,
    });
  } else if (message.member.id == "440328038337478657") {
    // Saucy
    conversationLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. He assumes the persona of a sausage and is a moderator here who also umpires baseball games and moderates our subreddit.`,
    });
  } else if (
    message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    conversationLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. They are a moderator of our Discord community.`,
    });
  } else if (
    message.member.premiumSince &&
    !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    conversationLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. They have boosted the server which means they have paid money to support our community and are a highly regarded community member`,
    });
  } else {
    conversationLog.unshift({
      role: "system",
      content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}.`,
    });
  }

  conversationLog.unshift({
    role: "system",
    content: `This conversation takes place on the Discord server "On Patrol Live" for the community of fans of the television show On Patrol: Live.`,
  });
  conversationLog.unshift({
    role: "system",
    content: `Respond like an affable, charismatic Discord chatbot kitten named OPie that exudes charm, wit, and friendliness`,
  });

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

  // Ensure the model name is valid
  const modelName = "gpt-4.1-mini"; // Replace with a valid model name if necessary

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
      model: modelName,
      messages: truncatedLog,
      max_tokens: 1024, // limit token usage (length of response)
    };
  } else {
    apiPackage = {
      model: modelName,
      messages: truncatedLog,
      max_tokens: 256, // limit token usage (length of response)
    };
  }

  // console.log(apiPackage);

  try {
    const result = await openai.createChatCompletion(apiPackage);
    if (
      result &&
      result.data &&
      result.data.choices &&
      result.data.choices[0]
    ) {
      return result.data.choices[0].message.content;
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
