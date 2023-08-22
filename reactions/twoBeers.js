module.exports = {
    name: "TwoBeers",
    logName: "🍻 2BEERS",
    regex: "(2 beer|two beer)",
    async execute(message) {
        if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
            message.react(`<a:two_beer_mugs:1038932370352521406>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react(`🍻`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}