const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "Vomit",
    logName: "🤮 VOMIT ",
    regex: "\\bdust\\b(.){0,12}\\bvomit\\b",
    async execute(message) {
        const imageDelay = 900;
        const lastImage = message.client.timers.get("image-vomit") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay) {
            message.client.timers.set("image-vomit", message.createdTimestamp);
            const combustImage = new AttachmentBuilder("./resources/reaction-vomit.gif", { name: "reaction-vomit.gif" });
            message.reply({ files: [combustImage] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
            if (message.guild.id == "325206992413130753") {
                message.react(`<a:vomiting:1109159906419949670>`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            } else {
                message.react(`🤮`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            }
        }
    }
}