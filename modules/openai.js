require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async function (message) {
  // try {
    await message.channel.sendTyping();
    let conversationLog = [{ role: 'system', content: 'Answer as a friendly, concise, chatbot kitten named OPie.' }];
    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    let userCount = 0;
    let botCount = 0;
    prevMessages.forEach((msg) => {
      //console.log(msg.content);
      switch (msg.author.id) {
        case message.client.user.id:
          if (botCount < 3) {
            botCount++;
            conversationLog.push({
              role: 'assistant',
              content: msg.content,
              name: msg.member.displayName,
            });
            // console.log(`User : ${msg.memberdisplayName}`);
            break;
          }
        case message.author.id:
          if (userCount < 3 && message.content.match(/^(opie,)/gi)) {
            userCount++;
            conversationLog.push({
              role: 'user',
              content: msg.content,
              name: msg.member.displayName,
            });
            // console.log(`User : ${msg.member.displayName}`);
            // console.log(`User: ${msg.content}`);
            break;
          }
      }
    });
    conversationLog.reverse();

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
