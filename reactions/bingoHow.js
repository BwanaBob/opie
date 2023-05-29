const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "BingoHow",
    logName: "🤘 HOWBGO",
    regex: "(how|where).*(find|play|get).*(bingo|card)",
    async execute(message) {
        const bingoEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Bingo")
            .setDescription("Get your bingo cards and play with us live!")
            .setURL('https://www.thatsabingo.com/')
            .setThumbnail(
                "https://i.imgur.com/dJP9d8L.png"
            );

        const bingoButton = new ButtonBuilder()
            .setLabel('Play Now')
            .setURL('https://www.thatsabingo.com')
            .setStyle(ButtonStyle.Link);

        const bingoRow = new ActionRowBuilder()
            .addComponents(bingoButton);

        message.reply({
            embeds: [bingoEmbed],
            components: [bingoRow]
        });
    }
}