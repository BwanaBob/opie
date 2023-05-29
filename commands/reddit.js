const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

const redditEmbed = new EmbedBuilder()
  .setColor(0xff4500)
  .setTitle("Reddit")
  .setDescription("Join the discussion on Reddit at r/OnPatrolLive")
  .setURL('https://www.reddit.com/r/OnPatrolLive/')
  .setThumbnail(
    "https://i.imgur.com/sd2bsMa.png"
  );

const redditButton = new ButtonBuilder()
  .setLabel('reddit.com')
  .setURL('https://www.reddit.com/r/OnPatrolLive/')
  .setStyle(ButtonStyle.Link);

const redditRow = new ActionRowBuilder()
  .addComponents(redditButton);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reddit")
    .setDescription("Join us on Reddit")
    .setDMPermission(true),
  async execute(interaction) {
    // await interaction.reply({ content: bingoMessage, ephemeral: true });
    const messageId = await interaction.reply({
      embeds: [redditEmbed],
      components: [redditRow]
    });
  },
};
