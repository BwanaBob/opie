require("dotenv").config();
const { OpenAI } = require('openai'); // Correct import
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY }); // Correct initialization

module.exports = async function (aicommand) {
    try {
        const result = await openai.chat.completions.create(aicommand);
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
