const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "Lume",
    logName: "🍑 LUME  ",
    regex: "\\blume\\b",
    async execute(message) {
        const imageDelay = 300;
        const lastImage = message.client.timers.get("image-lume") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay) {
            message.client.timers.set("image-lume", message.createdTimestamp);
            const wendysImage = new AttachmentBuilder("./resources/reaction-lume.png", { name: "reaction-lume.png" });
            message.reply({ files: [wendysImage] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
            message.react(`🍑`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}
