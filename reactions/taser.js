module.exports = {
    name: "Taser",
    logName: "⚡ TASER ",
    regex: "(taser|tased)",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<a:high_voltage_zap:1111530328864063528>`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        } else {
            message.react('⚡')
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}