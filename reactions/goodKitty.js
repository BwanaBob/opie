module.exports = {
    name: "GoodKitty",
    logName: "😻 GD CAT",
    regex: "\\b(good|great|best|wonderful|pretty)\\b.(kitty|cat|kitten|feline)\\b",
    async execute(message) {
        if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
            message.react(`<a:cat_heart_eyes:1109155796056539227>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react('😻')
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}