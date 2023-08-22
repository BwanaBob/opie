module.exports = {
    name: "Taser",
    logName: "⚡ TASER ",
    regex: "(taser|tased)",
    async execute(message) {
        if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
            message.react(`<a:high_voltage_zap:1111530328864063528>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react('⚡')
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}