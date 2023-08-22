module.exports = {
    name: "DinoNuggets",
    logName: "🐢 D NUGS",
    regex: "\\bdino(saur)?(s)?\\b.{1,25}\\bnug(g)?(et|ie)?(s)?\\b",
    async execute(message) {
        if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
            message.react(`<:dino_nugget:1111766293897560197>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react('🦕')
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}