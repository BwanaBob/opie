const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "LastAd",
    logName: "📺 LASTAD",
    regex: "(?:4|7|four|seven|quatro|siete|quatre|sept|vier|sieben).minut(?:e|es|o|os)?",
    async execute(message) {
        const imageDelay = 5400; // seconds 5400 = 1.5hr
        const lastImage = message.client.timers.get("image-last-ad") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        const now = new Date();
        const currentDay = now.getUTCDay();
        const currentHour = now.getUTCHours();
        const currentMinute = now.getUTCMinutes();
        // console.log(`D: ${currentDay} H:${currentHour} M:${currentMinute} Id:${message.author.id}`);
        if ((message.author.id == '844616406293151745' &&
            (elapsed > imageDelay) &&
            (currentDay === 6 || currentDay === 0) &&
            currentHour === 3 &&
            currentMinute >= 46) ||
            (message.author.id == '348629137080057878')) {
            message.client.timers.set("image-last-ad", message.createdTimestamp);
            const replyImages = ["./resources/reaction-last-ad-01.gif", "./resources/reaction-last-ad-02.gif", "./resources/reaction-last-ad-03.gif", "./resources/reaction-last-ad-04.gif", "./resources/reaction-last-ad-05.gif"]
            const currentDate = new Date();
            const replyImageIndex = Math.floor(currentDate.getTime() / (1000 * 60 * 60 * 24)) % replyImages.length
            const replyImage = replyImages[replyImageIndex];
            const replyImageAttachment = new AttachmentBuilder(replyImage, { name: "reaction-last-ad.gif" });
            message.reply({ files: [replyImageAttachment] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        }
    }
}
