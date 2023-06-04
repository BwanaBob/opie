module.exports = {
    name: "TwoBeers",
    logName: "🍻 2BEERS",
    regex: "(2 beer|two beer)",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<a:two_beer_mugs:1038932370352521406>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react(`🍻`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}