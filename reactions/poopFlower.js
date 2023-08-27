const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "PoopFlower",
    logName: "🌼 POOPFL",
    regex: "(poop(\\W|_).*flowers)",
    async execute(message) {
        const imageDelay = 5400; // seconds 5400 = 1.5hr
        const lastImage = message.client.timers.get("image-poop-flower") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay) {
            message.client.timers.set("image-poop-flower", message.createdTimestamp);
            const replyImage = new AttachmentBuilder("./resources/reaction-poop-flower.gif", { name: "reaction-poop-flower.gif" });
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
