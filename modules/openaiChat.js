const { PermissionsBitField } = require("discord.js");
require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async function (message) {
  // try {
  await message.channel.sendTyping();
  let conversationLog = new Array
  let prevMessages = await message.channel.messages.fetch({ limit: 20 });
  let userCount = 0;
  let botCount = 0;
  prevMessages.forEach((msg) => {
    if ((msg.author.id === message.client.user.id) && (botCount < 4)) {
      botCount++;
      conversationLog.unshift({
        role: 'assistant',
        content: msg.content,
        //name: msg.member.displayName,
      });
    } else if ((msg.author.id === message.author.id) && (userCount < 4) && (msg.content.match(/^(opie,\W)/gi))) {
      userCount++;
      conversationLog.unshift({
        role: 'user',
        content: msg.content.substr(6),
        //name: msg.member.displayName,
      });
    }
  })

  conversationLog.unshift({ role: 'system', content: 'Respond like a friendly, snarky, discord chatbot kitten named OPie' });
  let apiPackage = {};
  if (message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    apiPackage = {
      model: 'gpt-3.5-turbo',
      messages: conversationLog,
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
