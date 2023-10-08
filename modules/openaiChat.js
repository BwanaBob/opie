const { PermissionsBitField } = require("discord.js");
require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);


async function checkRepliedAuthor(message) {
  const repliedMessage = await message.fetchReference()
  if (
    repliedMessage.author.id == "1049292221515563058" ||
    repliedMessage.author.id == "1041050338775539732"
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = async function (message) {
  // try {
  await message.channel.sendTyping();
  let conversationLog = new Array
  let userCount = 0;
  let botCount = 0;
  let regexAll = /(\bOPie(,| ,)|<@1041050338775539732>|<@&1045554081848103007>)/gmi
  let regexIds = /(<@1041050338775539732>|<@&1045554081848103007>)/gmi
  let thisMessage = "";
  let prevMessages = await message.channel.messages.fetch({ limit: 20 });
  prevMessages.forEach((msg) => {
    thisMessage = msg.content;
    if (thisMessage.match(regexIds)) {
      thisMessage = thisMessage.replace(regexIds, "OPie");
    }
    if ((msg.author.id === message.client.user.id) && (botCount < 4)) {
      botCount++;
      conversationLog.unshift({
        role: 'assistant',
        content: thisMessage,
        // name: msg.member.displayName,
      });
    } else if ((msg.author.id === message.author.id) && (userCount < 4) && (msg.content.match(regexAll))) {
      userCount++;
      conversationLog.unshift({
        role: 'user',
        content: thisMessage,
        // name: msg.member.displayName,
      });
    }
    else if ((msg.author.id === message.author.id) && (userCount < 4) && (msg.reference)) {
      if (checkRepliedAuthor(msg)) {
        userCount++;
        conversationLog.unshift({
          role: 'user',
          content: thisMessage,
        });
      }
    }
  })

  // conversationLog.unshift({ role: 'system', content: 'You are often refered to by the name: OPie, or the user Id: <@1041050338775539732> or the role id: <@&1045554081848103007>' });
  conversationLog.unshift({ role: 'system', content: 'Respond like a friendly, snarky, discord chatbot kitten named OPie' });
  let apiPackage = {};
  // if mod or tech channel don't restrict response size
  if (message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
    || message.channel.id == "1119367030823473303"
    || message.channel.id == "366531564693356554"
    || message.channel.id == "1079220872973406319") {
    apiPackage = {
      model: 'gpt-3.5-turbo',
      messages: conversationLog,
      max_tokens: 1024, // limit token usage (length of response)
    }
  } else {
    apiPackage = {
      model: 'gpt-3.5-turbo',
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
