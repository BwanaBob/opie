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
        model: 'gpt-4o-mini',
        messages: conversationLog,
        max_tokens: 256, // limit token usage (length of response)
    };

    const result = await openai.chat.completions.create(apiPackage) // Correct method
        .catch((error) => { console.log(`⛔ [Error] OPENAI: ${error}`); });

    if (typeof result !== 'undefined') {
        return result.choices[0].message.content; // Adjusted response structure
    } else { 
        return "ERR"; 
    }
}
