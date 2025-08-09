const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { getLeaderboard } = require("../modules/kudos");
const { sendKudosLeaderboardText } = require("../modules/kudosEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kudos-leaderboard")
    .setDescription("Display the Kudos leaderboard for recent episodes.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option.setName("episodes")
        .setDescription("Comma-separated list of episode dates (YYYY-MM-DD)")
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("Channel to display leaderboard in (defaults to this channel)")
        .setRequired(false)
    ),
  async execute(interaction) {
    const episodesRaw = interaction.options.getString("episodes");
    const episodeDates = episodesRaw.split(",").map(s => s.trim()).filter(Boolean);
    if (!episodeDates.length) {
      await interaction.reply({
        content: "You must provide at least one episode date (YYYY-MM-DD).",
        flags: MessageFlags.Ephemeral
      });
      return;
    }
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const leaderboard = getLeaderboard(episodeDates, 10);
    await sendKudosLeaderboardText(channel, leaderboard, { title: `**Kudos Leaderboard**`, description: `_Top contributors for episodes: ${episodeDates.join(", ")}_` });
    await interaction.reply({
      content: `Leaderboard sent to <#${channel.id}>!`,
      flags: MessageFlags.Ephemeral
    });
  }
};
