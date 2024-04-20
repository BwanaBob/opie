const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "LastAd",
    logName: "📺 LASTAD",
    regex: "(?:4|7).minute(?:s)?",
    async execute(message) {
        const imageDelay = 5400; // seconds 5400 = 1.5hr
        const lastImage = message.client.timers.get("image-last-ad") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        const now = new Date();
        const currentDay = now.getUTCDay();
        const currentHour = now.getUTCHours() - 5; // UTC to Central Time conversion
        const currentMinute = now.getUTCMinutes();
        if ((message.author.id == '844616406293151745' &&
            (elapsed > imageDelay) &&
            (currentDay === 5 || currentDay === 6) &&
            currentHour === 22 &&
            currentMinute >= 46) ||
            (message.author.id == '348629137080057878')) {
            message.client.timers.set("image-last-ad", message.createdTimestamp);
            const replyImage = new AttachmentBuilder("./resources/reaction-mentioned.gif", { name: "reaction-caca-flores.gif" });
            message.reply({ files: [replyImage] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        }
    }
}
