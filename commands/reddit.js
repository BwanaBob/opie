const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");

const redditImage = new AttachmentBuilder("./resources/thumb-reddit.png", {name: "thumb-reddit.png"});
const redditEmbed = new EmbedBuilder()
  .setColor(0xff4500)
  .setTitle("Reddit")
  .setDescription("Join the discussion on Reddit at r/OnPatrolLive")
  .setURL('https://www.reddit.com/r/OnPatrolLive/')
  .setThumbnail("attachment://thumb-reddit.png");

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
    const messageId = await interaction.reply({
      embeds: [redditEmbed],
      components: [redditRow],
      files: [redditImage]
    });
  },
};
