const { PermissionsBitField } = require("discord.js");
require("dotenv").config();
const { OpenAI } = require('openai'); // Correct import
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY }); // Correct initialization

module.exports = async function (message) {
    let conversationLog = new Array;
    conversationLog.unshift({
        role: 'user',
        content: message.content,
        // name: msg.member.displayName,
    });
    conversationLog.unshift({ role: 'system', content: 'You will be provided with a message and your task is to provie a clever response using only Discord emojis.' });

    let apiPackage = {
        model: 'gpt-4.1-mini',
        messages: conversationLog,
        max_completion_tokens: 256, // limit token usage (length of response)
    };

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
}
