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
  let prevMessages = await message.channel.messages.fetch({ limit: 15 });
  let userCount = 0;
  let botCount = 0;
  prevMessages.forEach((msg) => {
    //console.log(msg.content);
    // switch (msg.author.id) {
    //   case message.client.user.id:
    if (msg.author.id == message.client.user.id && botCount < 3) {
      botCount++;
      conversationLog.unshift({
        role: 'assistant',
        content: msg.content,
        //name: msg.member.displayName,
      });
      //console.log(`Bot  : ${msg.member.displayName} Msg: ${msg.content}`);
    } else if (msg.author.id == message.author.id
      && userCount < 3
      && msg.content.match(/^(opie,\W)/gi)) {
      userCount++;
      conversationLog.unshift({
        role: 'user',
        content: msg.content.substr(6),
        //name: msg.member.displayName,
      });
      //console.log(`User : ${msg.member.displayName} Msg: ${msg.content.substr(6)}`);
    }
  })

//conversationLog.reverse();
conversationLog.unshift ({ role: 'system', content: 'Respond like a friendly, snarky, chatbot kitten named OPie' });

const result = await openai.createChatCompletion({
  model: 'gpt-3.5-turbo',
  messages: conversationLog,
  max_tokens: 192, // limit token usage (length of response)
})
  .catch((error) => {
    console.log(`OPENAI ERR: ${error}`);
  });
// } catch (error) {
//   console.log(`ERROR: ${error}`);
// }

if (typeof result !== 'undefined') {
  return result.data.choices[0].message.content
} else { return "ERR" }
}
