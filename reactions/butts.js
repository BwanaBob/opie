module.exports = {
    name: "Butts",
    logName: "🍑 BUTTS ",
    regex: "\\bbutts\\b",
    async execute(message) {
        if (message.channel.name == "mod-business" || message.channel.name == "bot-test") { return; } // Messes with Roll Call reactions
        if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
            message.react(`🍑`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react(`🍑`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}