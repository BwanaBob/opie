const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bingo")
    .setDescription("How do I play Bingo?")
    .setDMPermission(true),
  async execute(interaction) {
    // await interaction.reply({ content: bingoMessage, ephemeral: true });
    const messageId = await interaction.reply({ embeds: [ bingoEmbed ] });
  },
};
