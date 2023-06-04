module.exports = {
    name: "JawsOfLife",
    logName: "🔧 JAWSLF",
    regex: "(jaws of life)",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<:jaws_of_life:1093940607732416623>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react(`🔧`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}