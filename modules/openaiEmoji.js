const { PermissionsBitField } = require("discord.js");
require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async function (message) {
    let conversationLog = new Array
    conversationLog.unshift({
        role: 'user',
        content: message.content,
        // name: msg.member.displayName,
    });
    conversationLog.unshift({ role: 'system', content: 'You will be provided with a message and your task is to provie a clever response using only Discord emojis.' });

    let apiPackage = {
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        max_tokens: 256, // limit token usage (length of response)
    }

    const result = await openai.createChatCompletion(apiPackage)
        .catch((error) => { console.log(`⛔ [Error] OPENAI: ${error}`); });

    if (typeof result !== 'undefined') {
        return result.data.choices[0].message.content
    } else { return "ERR" }
}
