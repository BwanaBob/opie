module.exports = {
    name: "PoopFlower",
    logName: "🌼 POOPFL",
    regex: "(poop(\\W|_).*flowers)",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<:pooph:1073752699914420244>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react(`🌼`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}