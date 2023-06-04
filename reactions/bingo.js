module.exports = {
    name: "Bingo",
    logName: "🎱 BINGO ",
    regex: "bingo",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<:bingo:1066838689814163466>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react(`🎱`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}