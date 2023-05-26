module.exports = {
    name: "Dinosaur",
    logName: "🦕 DINO  ",
    regex: "\\b(dino|dinos|dinosaur|dinosaurs)\\b",
    async execute(message) {
        message.react('🦕')
    }
}