module.exports = {
    name: "Taser",
    logName: "⚡ TASER ",
    regex: "(taser|tased)",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<a:high_voltage_zap:1111530328864063528>`);
        } else {
            message.react('⚡')
        }
    }
}