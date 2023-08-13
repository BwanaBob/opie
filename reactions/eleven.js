const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "Eleven",
    logName: "🎛️ GOTO11",
    regex: "\\bgo.to.(11|eleven)\\b",
    async execute(message) {
        const imageDelay = 900;
        const lastImage = message.client.timers.get("image-eleven") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay) {
            message.client.timers.set("image-eleven", message.createdTimestamp);
            const elevenImage = new AttachmentBuilder("./resources/reaction-eleven.gif", { name: "reaction-eleven.gif" });
            message.reply({ files: [elevenImage] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
            if (message.guild.id == "325206992413130753") {
                message.react(`🎛️`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            } else {
                message.react(`🎛️`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            }
        }
    }
}
