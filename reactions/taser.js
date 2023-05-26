module.exports = {
    name: "Taser",
    logName: "⚡ TASER ",
    regex: "(taser|tased)",
    async execute(message) {
        message.react('⚡')
    }
}