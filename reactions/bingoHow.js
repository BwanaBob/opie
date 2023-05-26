const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "BingoHow",
    logName: "🤘 HOWBGO",
    regex: "(how|where).*(find|play|get).*(bingo|card)",
    async execute(message) {
        const bingoEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Bingo")
            .setDescription("Get your bingo cards and play with us live!")
            .addFields({
                name: "Website",
                value: `[thatsabingo.com](https://www.thatsabingo.com/)`,
                inline: true,
            })
            .setURL('https://www.thatsabingo.com/')
            .setThumbnail(
                "https://i.imgur.com/dJP9d8L.png"
            );

        message.reply({ embeds: [bingoEmbed] });
    }
}