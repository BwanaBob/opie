const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "Tommy",
    logName: "💪 TOMMY ",
    regex: "(tommy\\Wcopper)",
    async execute(message) {
        const imageDelay = 900;
        const lastImage = message.client.timers.get("image-tommy") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay) {
            message.client.timers.set("image-tommy", message.createdTimestamp);
            const replyImage = new AttachmentBuilder("./resources/reaction-tommy.png", { name: "reaction-tommy.png" });
            message.reply({ files: [replyImage] })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
            if (message.guild.id == "325206992413130753") {
                message.react(`<:tommy_copper:1141177458951995452>`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            } else {
                message.react(`💪`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            }
        }
    }
}
