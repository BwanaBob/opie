module.exports = {
    name: "GoodBot",
    logName: "🥰 GD BOT",
    regex: "Good Bot",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<a:smiling_hearts:1038217476225388574>`);
        } else {
            message.react('🥰')
        }
    }
}