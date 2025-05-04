require("dotenv").config();
const { OpenAI } = require('openai'); // Correct import
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY }); // Correct initialization

module.exports = async function (aicommand) {
    const result = await openai.chat.completions.create(aicommand) // Correct method
        .catch((error) => {
            console.log(`⛔ [Error] OPENAI: ${error}`);
        });

    if (typeof result !== 'undefined') {
        return result.choices[0].message.content; // Adjusted response structure
    } else { 
        return "ERR"; 
    }
}
