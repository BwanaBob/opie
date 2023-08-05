const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "Combust",
    logName: "🔥 CMBUST",
    regex: "\\bspontan(i|e)ous(ly)?\\Wcombust(ion|ed|s)?\\b",
    async execute(message) {
        const imageDelay = 900;
        const lastImage = message.client.timers.get("image-combust") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay) {
            message.client.timers.set("image-combust", message.createdTimestamp);
            const combustImage = new AttachmentBuilder("./resources/reaction-combust.gif", { name: "reaction-combust.gif" });
            message.reply({ files: [combustImage] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
            if (message.guild.id == "325206992413130753") {
                message.react(`<a:fire_animated:1038932374542614588>`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            } else {
                message.react(`🔥`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            }
        }
    }
}
