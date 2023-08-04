const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "BuffOut",
    logName: "🚗 BUFOUT",
    regex: "(Buff Out)",
    async execute(message) {
        if ((message.author.id == "440328038337478657") || (message.author.id == "687155636244578304")) { //saucy or bwana's alt
            // message.channel.send(`🚗 Come on down to ${message.member}'s car repair shop! Everything can be buffed out! 🚗`);
            const image = new AttachmentBuilder('./resources/reaction-buff-out.png');
            message.reply({ files: [image] })
        } else {
            message.react('🚗')
                .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
        }
    }
}