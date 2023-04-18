require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async function (message) {
  await message.channel.sendTyping();
  let conversationLog = [{ role: 'system', content: 'You are a friendly, concise chatbot with an ascerbic wit.' }];
  let prevMessages = await message.channel.messages.fetch({ limit: 15 });
  let userCount = 0;
  let botCount = 0;
  prevMessages.forEach((msg) => {
    //console.log(msg.content);
    switch (msg.author.id) {
      case message.client.user.id:
        if (botCount <= 3) {
          botCount++;
          conversationLog.push({
            role: 'assistant',
            content: msg.content,
          });
          // console.log(`Bot : ${msg.content}`);
          break;
        }
      case message.author.id:
        if (userCount <= 3 && message.content.match(/^(opie,)/gi)) {
          userCount++;
          conversationLog.push({
            role: 'user',
            content: msg.content,
          });
          // console.log(`User: ${msg.content}`);
          break;
        }
    }
  });
  conversationLog.reverse();
  const result = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: conversationLog,
  })
  return result.data.choices[0].message.content
}
