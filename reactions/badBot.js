module.exports = {
    name: "BadBot",
    logName: "😢 BD BOT",
    regex: "Bad Bot",
    async execute(message) {
        message.react('😢')
    }
}