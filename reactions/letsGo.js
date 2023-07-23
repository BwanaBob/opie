module.exports = {
    name: "LetsGo",
    logName: "🚨 LETSGO",
    regex: "\\b(here(.{0,12})we|let(.)?s)(.{0,12})go(o)*\\b",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<a:police_car_light:1038193703854030878>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react(`🚨`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}