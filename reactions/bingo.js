module.exports = {
    name: "Bingo",
    logName: "🎱 BINGO ",
    regex: "bingo",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<:bingo:1066838689814163466>`);
        } else {
            message.react(`🎱`);
        }
    }
}