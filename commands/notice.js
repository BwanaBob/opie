const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const noticeMessage = `Notice sent`;
const noticeEmbed = new EmbedBuilder()
.setColor(0xffce07)
.setTitle("Safe Place Reminder")
.setDescription(
  "Please keep in mind, younger viewers join us."
)
.setThumbnail(
    "https://i.imgur.com/yunluXs.png"
)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notice")
    .setDescription("Send a notice to the current channel")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.reply({ content: noticeMessage, ephemeral: true });
    interaction.channel.send({ embeds: [noticeEmbed] });
  },
};





