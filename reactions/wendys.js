const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "Combust",
    logName: "🍔 WENDYS",
    regex: "(sir|ma('|d)?am)(\\W){1,2}(this.is|you(')?re.in).a.wendy(')?s",
    async execute(message) {
        const imageDelay = 300;
        const lastImage = message.client.timers.get("image-wendys") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay) {
            message.client.timers.set("image-wendys", message.createdTimestamp);
            const wendysImage = new AttachmentBuilder("./resources/reaction-wendys.png", { name: "reaction-wendys.png" });
            message.reply({ files: [wendysImage] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
            message.react(`🍔`)
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}