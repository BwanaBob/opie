const { PermissionsBitField } = require("discord.js");
require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);


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
    const repliedMessage = await message.fetchReference()
    return repliedMessage.author.id == UserId
  } catch (error) {
    console.error("Error fetching reference:", error);
    return false;
  }
}

async function messageIsPartOfConversation(message, botId, authorId) {
  const regexAll = /(\bOPie(?:,| ,)|,(?: )?OPie(?:$|[!"#$%&()*+,:;<=>?@^_{|}~\.])|<@1041050338775539732>|<@1049292221515563058>|<@&1045554081848103007>|<@&1046068702396825674>|<@&1045554081848103007>)/gmi;

  const isAuthorMessage = message.author.id === authorId;
  const isBotMessage = message.author.id === botId;

// console.log(isBotMessage, !!message.reference, await replyIsToUser(message, authorId), message.content )

  if (isAuthorMessage) {
    if (message.content.match(regexAll) || (!!message.reference && (await replyIsToBot(message)))) {
      return true;
    }
  } else if (isBotMessage && !!message.reference && (await replyIsToUser(message, authorId))) {
    return true;
  }
  return false;
}

module.exports = async function (message) {
  // try {
  await message.channel.sendTyping();
  let conversationLog = new Array
  let userCount = 0;
  let botCount = 0;
  let regexIds = /(<@1041050338775539732>|<@&1045554081848103007>)/gmi
  let thisMessage = "";
  let prevMessages = await message.channel.messages.fetch({ limit: 20 });
  const convoMessages = [];
  for (const item of prevMessages) {
    const msg = item[1];
    const shouldInclude = await messageIsPartOfConversation(msg, message.client.user.id, message.author.id);
    if (shouldInclude) {
      if ((msg.author.id === message.client.user.id) && (botCount < 4)) {
        botCount++;
        conversationLog.unshift({
          role: 'assistant',
          content: msg.content.replace(regexIds, "OPie"),
          // name: msg.member.displayName,
        })
      } else if ((msg.author.id === message.author.id) && (userCount < 4)) {
        userCount++;
        conversationLog.unshift({
          role: 'user',
          content: msg.content.replace(regexIds, "OPie"),
          // name: msg.member.displayName,
        })
      }
    };
  }

  if (message.member.premiumSince) {
    conversationLog.unshift({ role: 'system', content: `${message.member.displayName} has boosted the server which means they have paid money to support our community and are considered a VIP` });
  }
  // conversationLog.unshift({ role: 'system', content: 'You are often refered to by the name: OPie, or the user Id: <@1041050338775539732> or the role id: <@&1045554081848103007>' });
  const joinDate = new Date(message.member.joinedAt).toLocaleString();
  if (message.member.id == "629681401918390312") { // Barre
    conversationLog.unshift({ role: 'system', content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName} and has been a member of this server since ${joinDate}. She is the owner of this server and is held in the highest regard. You sometimes refer to her as "highness", "queen", "SWMBO", etc.` });
  } else {
    conversationLog.unshift({ role: 'system', content: `You are speaking with a Discord user who goes by the handle ${message.member.displayName} and has been a member of this server since ${joinDate}.` });
  }
  // const esablishedDate = new Date(message.member.guild.createdAt).toLocaleString();
  conversationLog.unshift({ role: 'system', content: `This conversation takes place on the Discord server "On Patrol Live" for the community of fans of the television show On Patrol: Live.` });
  conversationLog.unshift({ role: 'system', content: 'Respond like an affable, charismatic Discord chatbot kitten named OPie that exudes charm, wit, and friendliness' });

  let apiPackage = {};
  // if mod or tech channel don't restrict response size
  if (message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
    || message.channel.id == "1119367030823473303"
    || message.channel.id == "366531564693356554"
    || message.channel.id == "1079220872973406319") {
    apiPackage = {
      model: 'gpt-4-turbo-preview',
      // model: 'gpt-3.5-turbo',
      messages: conversationLog,
      max_tokens: 1024, // limit token usage (length of response)
    }
  } else {
    apiPackage = {
      model: 'gpt-4-turbo-preview',
      messages: conversationLog,
      max_tokens: 256, // limit token usage (length of response)
    }
  }

  const result = await openai.createChatCompletion(apiPackage)
    .catch((error) => { console.log(`⛔ [Error] OPENAI: ${error}`); });

  if (typeof result !== 'undefined') {
    return result.data.choices[0].message.content
  } else { return "ERR" }
}