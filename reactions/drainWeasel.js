const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "Drain Weasel",
    logName: "🪠 WEASEL",
    regex: "\\bdrain\\Wweasel\\b",
    async execute(message) {
        const imageDelay = 5400; // seconds 5400 = 1.5hr
        const lastImage = message.client.timers.get("image-weasel") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay) {
            message.client.timers.set("image-weasel", message.createdTimestamp);
            const weaselImage = new AttachmentBuilder("./resources/reaction-drain-weasel.png", { name: "reaction-lume.png" });
            message.reply({ files: [weaselImage] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
            message.react(`🪠`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}
