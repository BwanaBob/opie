module.exports = {
    name: "Easter",
    logName: "🐰 EASTER",
    regex: "(happy).(easter)",
    async execute(message) {
        message.react('🐰')
    }
}