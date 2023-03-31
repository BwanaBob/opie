const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const redditEmbed = new EmbedBuilder()
.setColor(0xff4500)
.setTitle("Reddit")
.setDescription("Join the discussion on Reddit at r/OnPatrolLive")
.addFields({
  name: "Link",
  value: `[reddit.com](https://www.reddit.com/r/OnPatrolLive/)`,
  inline: true,
})
.setURL('https://www.reddit.com/r/OnPatrolLive/')
.setThumbnail(
    "https://i.imgur.com/sd2bsMa.png"
);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reddit")
    .setDescription("Join us on Reddit")
    .setDMPermission(true),
  async execute(interaction) {
    // await interaction.reply({ content: bingoMessage, ephemeral: true });
    const messageId = await interaction.reply({ embeds: [ redditEmbed ] });
  },
};
