module.exports = {
    name: "LetsGo",
    logName: "🚨 LETSGO",
    regex: "\\b((here\\b((.){0,12})\\bwe|let(.)?s)\\b((.){0,12})\\bgo(o)*)\\b|\\b(va(a)*m(a(a)*n)?o(o)*s(s)*)\\b",
    async execute(message) {
        if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
            message.react(`<a:police_car_light:1038193703854030878>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react(`🚨`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}