const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { getLeaderboard } = require("../modules/kudos");
const { sendKudosLeaderboardText } = require("../modules/kudosEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kudos-leaderboard")
  .setDescription("Display the Kudos leaderboard for recent episodes (by episode name).")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option.setName("episodes")
        .setDescription("Comma-separated list of episodes, or a number for N most recent episodes (e.g. 5 or S01E01,S01E02)")
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("Channel to display leaderboard in (defaults to this channel)")
        .setRequired(false)
    ),
  async execute(interaction) {
    const episodesRaw = interaction.options.getString("episodes");
    let episodes;
    if (/^\d+$/.test(episodesRaw.trim())) {
      // If input is a number, get that many most recent episodes
      const n = parseInt(episodesRaw.trim(), 10);
      episodes = require("../modules/kudos").getRecentEpisodes(n);
    } else {
      episodes = episodesRaw.split(",").map(s => s.trim()).filter(Boolean);
    }
    if (!episodes.length) {
      await interaction.reply({
        content: "You must provide at least one episode name or a valid number.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const leaderboard = getLeaderboard(episodes, 10);
    await sendKudosLeaderboardText(channel, leaderboard, { title: `**Kudos Leaderboard**`, description: `_Top contributors for episodes: ${episodes.join(", ")}_` });
    await interaction.reply({
      content: `Leaderboard sent to <#${channel.id}>!`,
      flags: MessageFlags.Ephemeral
    });
  }
};
