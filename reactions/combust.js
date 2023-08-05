const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "Combust",
    logName: "🔥 CMBUST",
    regex: "\\bspontan(i|e)ous(ly)?\\Wcombust(ion|ed|s)?\\b",
    async execute(message) {
        const lastTime = message.client.timers.get("Combust");
        const combustDelay = 900;
        var okToSend = false;
        if (lastTime == undefined) {
            okToSend = 'true';
        } else {
            const elapsed = Math.trunc(
                (message.createdTimestamp - lastTime) / 1000);
            if (elapsed < combustDelay) {
                okToSend = 'false';
            } else {
                okToSend = 'true';
            }
        }
        if (okToSend == 'true') {
            message.client.timers.set("Combust", message.createdTimestamp);
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