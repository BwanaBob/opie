module.exports = {
    name: "Dinosaur",
    logName: "🐢 DINO  ",
    regex: "\\bdino(saur)?(s)?\\b(?!.{1,55}\\bnug(g)?(et|ie)?(s)?\\b)",
    async execute(message) {
        message.react('🦕')
            .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
    }
}