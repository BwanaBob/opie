const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "Begonias",
    logName: "🌼 BGONAS",
    regex: "\bbegonias\b",
    async execute(message) {
        const imageDelay = 5400; // seconds 5400 = 1.5hr
        const lastImage = message.client.timers.get("image-begonias") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay) {
            message.client.timers.set("image-begonias", message.createdTimestamp);
            const begoniasImage = new AttachmentBuilder("./resources/reaction-begonias.png", { name: "reaction-begonias.png" });
            message.reply({ files: [begoniasImage] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
            if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
                message.react(`<:chief_bradley_taylor:1176381932955783168>`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            } else {
                message.react(`🌼`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            }
        }
    }
}
