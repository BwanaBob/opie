require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async function (aicommand) {
    // try {
    const result = await openai.createChatCompletion( aicommand )
        .catch((error) => {
            console.log(`OPENAI ERR: ${error}`);
        });
    // } catch (error) {
    //   console.log(`ERROR: ${error}`);
    // }

    if (typeof result !== 'undefined') {
        //console.log(result.message);
        return result.data.choices[0].message.content
    } else { return "ERR" }
}
