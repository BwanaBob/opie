module.exports = {
    name: "OPieEmote",
    logName: "👋 OPieEm",
    regex: "🤖",
    async execute(message) {
        const openai = require('../modules/openaiEmoji.js');
        const aiReply = await openai(message);
        if (!aiReply.undefined && aiReply !== 'ERR') {
            const splitEmoji = (string) => [...new Intl.Segmenter().segment(string)].map(x => x.segment)
            let aiReplyArr = splitEmoji(aiReply)
            for (const thisEmoji of aiReplyArr) {
                const regex_emoji = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;
                if (regex_emoji.test(thisEmoji)) {
                    await message.react(thisEmoji)
                        .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} with emoji ${thisEmoji} -`, err.message); });
                }
            }
        } else {
            console.log("emoji retrieval failed")
        }
    }
}