const { AttachmentBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "CacaFlores",
    logName: "🌼 CACAFL",
    regex: "\\b(caca\\b.{1,12}\\bflores|flores\\b.{1,12}\\bcaca)\\b",
    async execute(message) {
        const imageDelay = 5400; // seconds 5400 = 1.5hr
        const lastImage = message.client.timers.get("image-caca-flores") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay || message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            message.client.timers.set("image-caca-flores", message.createdTimestamp);
            const replyImage = new AttachmentBuilder("./resources/reaction-caca-flores.gif", { name: "reaction-caca-flores.gif" });
            message.reply({ files: [replyImage] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
            if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
                message.react(`<:pooph:1073752699914420244>`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            } else {
                message.react(`🌼`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            }
        }
    }
}
