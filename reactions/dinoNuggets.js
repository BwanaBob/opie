module.exports = {
    name: "DinoNuggets",
    logName: "🐢 D NUGS",
    regex: "\\bdino(saur)?(s)?\\b.{1,25}\\bnug(g)?(et|ie)?(s)?\\b",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<:dino_nugget:1111766293897560197>`);
        } else {
            message.react('🦕')
        }
    }
}