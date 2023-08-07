module.exports = {
    name: "FlexSeal",
    logName: "💪 F-SEAL",
    regex: "\\bflex\\b.seal\\b",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<:flex_seal:1135098661941022740>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react(`💪`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}