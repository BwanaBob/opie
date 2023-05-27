module.exports = {
    name: "Dinosaur",
    logName: "🐢 DINO  ",
    regex: "\\bdino(saur)?(s)?\\b(?!.{1,55}\\bnug(get)?(s)?\\b)",
    async execute(message) {
        message.react('🦕')
    }
}