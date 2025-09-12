module.exports = {
    name: "RollCall",
    logName: "✋ ROLL  ",
    regex: "roll.call",
    async execute(message) {
        if (message.channel.name !== "mod-business" && message.channel.name !== "bot-test") { return; }
        if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
            message.react("<:discord_clyde:1157337181711515710>")
                .then(() => message.react("<:reddit_snoo:1129542362641739856>"))
                .then(() => message.react("<:bingo:1066838689814163466>"))
                .then(() => message.react("⛔"))
                .then(() => message.react("⏲️"))
                .then(() => message.react("🤷"))
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });

        } else {
            message.react("💬")
                .then(() => message.react("🤖"))
                .then(() => message.react("🎱"))
                .then(() => message.react("⛔"))
                .then(() => message.react("⏲️"))
                .then(() => message.react("🤷"))
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}