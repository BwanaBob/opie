module.exports = {
    name: "BadBot",
    logName: "😢 BD BOT",
    regex: "\\bbad bot\\b",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<a:crying:1046282457177141309>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react('😢')
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}