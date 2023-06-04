module.exports = {
    name: "Peacock",
    logName: "🐦 P-COCK",
    regex: "peacock",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<:NBC_peacock:1086865895709753404>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react(`🦚`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}