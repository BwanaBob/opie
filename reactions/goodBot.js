module.exports = {
    name: "GoodBot",
    logName: "🥰 GD BOT",
    regex: "\\bgood\\b.Bot\\b",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<a:smiling_hearts:1038217476225388574>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react('🥰')
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}