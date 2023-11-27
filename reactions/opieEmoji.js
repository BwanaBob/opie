module.exports = {
    name: "OPie",
    logName: "👋 OPie  ",
    regex: "\\bopie\\b(?!,)",
    async execute(message) {

        // AI reply test
        // Do not react if this is an AI chat message
        if (message.reference) {
            const repliedMessage = await message.fetchReference()
            if (
                (repliedMessage.author.id == "1049292221515563058" ||
                    repliedMessage.author.id == "1041050338775539732")
                && message.client.params.get("chatGPTEnabled") === "true"
            ) {
                return;
            }
        }

        // Do not react if this is an AI chat message
        if (message.content.match(
            /(\bOPie(?:,| ,)|,(?: )?OPie(?:$|[!"#$%&()*+,:;<=>?@^_{|}~\.])|<@1041050338775539732>|<@&1045554081848103007>)/gmi
        ) && message.client.params.get("chatGPTEnabled") === "true"
        ) { return }

        const openai = require('../modules/openaiEmoji.js');
        const aiReply = await openai(message);
        if (!aiReply.undefined && aiReply !== 'ERR') {
            const splitEmoji = (string) => [...new Intl.Segmenter().segment(string)].map(x => x.segment)
            let aiReplyArr = splitEmoji(aiReply)
            for (const thisEmoji of aiReplyArr) {
                const regex_emoji = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;
                if (regex_emoji.test(thisEmoji)) {
                    await message.react(thisEmoji)
                        .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
                }
            }
        } else {
            console.log("emoji retrieval failed")
        }
    }
}