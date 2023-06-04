const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "BuffOut",
    logName: "🚗 BUFOUT",
    regex: "(Buff Out)",
    async execute(message) {
        if (message.author.tag == "Sausageslinger11#3264") {
            // message.channel.send(`🚗 Come on down to ${message.member}'s car repair shop! Everything can be buffed out! 🚗`);
            const image = new AttachmentBuilder('https://i.imgur.com/gF0aNsT.png');
            message.reply({ files: [image] })
        } else {
            message.react('🚗')
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}