const { PermissionsBitField } = require("discord.js");
require("dotenv").config();
const { OpenAI } = require("openai"); // v5 compatible import
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY }); // v5 compatible initialization

async function replyIsToBot(message) {
  try {
    const repliedMessage = await message.fetchReference();
    const botIds = ["1049292221515563058", "1041050338775539732"];
    return botIds.includes(repliedMessage.author.id);
  } catch (error) {
    console.error("Error fetching reference:", error);
    return false;
  }
}

async function replyIsToUser(message, UserId) {
  try {
    const repliedMessage = await message.fetchReference();
    return repliedMessage.author.id == UserId;
  } catch (error) {
    console.error("Error fetching reference:", error);
    return false;
  }
}

async function messageIsPartOfConversation(message, botId, authorId) {
  const regexAll =
    /(\bOPie(?:,| ,)|,(?: )?OPie(?:$|[!"#$%&()*+,:;<=>?@^_{|}~\.])|<@1041050338775539732>|<@1049292221515563058>|<@&1045554081848103007>|<@&1046068702396825674>|<@&1045554081848103007>)/gim;

  const isAuthorMessage = message.author.id === authorId;
  const isBotMessage = message.author.id === botId;

  // console.log(isBotMessage, !!message.reference, await replyIsToUser(message, authorId), message.content )

  if (isAuthorMessage) {
    if (
      message.content.match(regexAll) ||
      (!!message.reference && (await replyIsToBot(message)))
    ) {
      return true;
    }
  } else if (
    isBotMessage &&
    !!message.reference &&
    (await replyIsToUser(message, authorId))
  ) {
    return true;
  }
  return false;
}

module.exports = async function (message) {
  // try {
  await message.channel.sendTyping();
  let conversationLog = new Array();
  let userCount = 0;
  let botCount = 0;
  let regexIds = /(<@1041050338775539732>|<@&1045554081848103007>)/gim;
  let thisMessage = "";

  let prevMessages = await message.channel.messages.fetch({ limit: 20 });
  const convoMessages = [];
  for (const item of prevMessages) {
    const msg = item[1];
    const shouldInclude = await messageIsPartOfConversation(
      msg,
      message.client.user.id,
      message.author.id
    );
    if (shouldInclude) {
      if (msg.author.id === message.client.user.id && botCount < 4) {
        botCount++;
        conversationLog.unshift({
          role: "assistant",
          content: [
            { type: "text", text: msg.content.replace(regexIds, "OPie") },
          ],
          // name: msg.member.displayName,
        });
      } else if (msg.author.id === message.author.id && userCount < 4) {
        userCount++;

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
        // console.log(thisMsgContent);
        conversationLog.unshift({
          role: "user",
          content: thisMsgContent,
          // name: msg.member.displayName,
        });
      }
    }
  }

  // conversationLog.unshift({ role: 'system', content: 'You are often refered to by the name: OPie, or the user Id: <@1041050338775539732> or the role id: <@&1045554081848103007>' });
  // const joinDate = new Date(message.member.joinedAt).toLocaleString();
  if (message.member.id == "629681401918390312") {
    // Barre
    conversationLog.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She is the owner of this server and is held in the highest regard. You sometimes refer to her as "highness", "queen", "SWMBO", etc.`,
        },
      ],
    });
  } else if (message.member.id == "348629137080057878") {
    // Bwana
    conversationLog.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. He is the resident I.T. nerd and your daddy.`,
        },
      ],
    });
  } else if (message.member.id == "511074631239598080" || message.member.id == "1358747746395361280") {
    // Ferret
    conversationLog.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She is an adorable ferret that we all love and a valued moderator here. She has a playful and mischievous side, sometimes swiping small household items like socks, but she also enjoys interacting with the community in fun and engaging ways. Occasionally, she needs a bath to keep her in check.`,
        },
      ],
    });
  } else if (message.member.id == "1250263798070247487") {
    // Chibi
    conversationLog.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She is a lovely small chibi. By day, she makes beautiful flower arrangements. By night, she's one of our beloved moderators.`,
        },
      ],
    });
  } else if (message.member.id == "303930225945870336") {
    // Kavzilla
    conversationLog.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. She assumes the persona of a bearded dragon and loves and keeps lizards, frogs, etc. She also works in I.T. and is one of our moderators here.`,
        },
      ],
    });
  } else if (message.member.id == "440328038337478657") {
    // Saucy
    conversationLog.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. He assumes the persona of a sausage and is a moderator here who also umpires baseball games and moderates our subreddit.`,
        },
      ],
    });
  } else if (
    message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    conversationLog.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. They are a moderator of our Discord community.`,
        },
      ],
    });
  } else if (
    message.member.premiumSince &&
    !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    conversationLog.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}. They have boosted the server which means they have paid money to support our community and are a highly regarded community member`,
        },
      ],
    });
  } else {
    conversationLog.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: `You are speaking with a Discord user who goes by the handle ${message.member.displayName}.`,
        },
      ],
    });
  }
  // const esablishedDate = new Date(message.member.guild.createdAt).toLocaleString();
  conversationLog.unshift({
    role: "system",
    content: [
      {
        type: "text",
        text: `This conversation takes place on the Discord server "On Patrol Live" for the community of fans of the television show On Patrol: Live.`,
      },
    ],
  });
  conversationLog.unshift({
    role: "system",
    content: [
      {
        type: "text",
        text: "Respond like an affable, charismatic Discord chatbot kitten named OPie that exudes charm, wit, and friendliness",
      },
    ],
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
      model: "gpt-4o-mini",
      messages: conversationLog,
      max_tokens: 1024, // limit token usage (length of response)
    };
  } else {
    apiPackage = {
      model: "gpt-4o-mini",
      messages: conversationLog,
      max_tokens: 256, // limit token usage (length of response)
    };
  }

  try {
    const result = await openai.chat.completions.create(apiPackage);
    if (result && result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
      return result.choices[0].message.content;
    } else {
      return "ERR";
    }
  } catch (error) {
    const errorDetails = error.error || error.response?.data || error.message || error.toString();
    console.log(`⛔ [Error] OPENAI:`, JSON.stringify(errorDetails, null, 2));
    return "ERR";
  }
};
