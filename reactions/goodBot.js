module.exports = {
    name: "GoodBot",
    logName: "🥰 GD BOT",
    regex: "\\bgood\\b.Bot\\b",
    async execute(message) {
        if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
            message.react(`<a:smiling_hearts:1038217476225388574>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react('🥰')
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}