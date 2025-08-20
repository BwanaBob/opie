const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { getUserTopMessages } = require("../modules/kudos");
const options = require("../options.json");
const episodeCount =
  options.modules &&
  options.modules.kudos &&
  options.modules.kudos.leaderboardEpisodes
    ? options.modules.kudos.leaderboardEpisodes
    : 10;
const episodeLabel = episodeCount === 1 ? "Episode" : "Episodes";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mystats")
    .setDescription(
      `Show your top messages and points for the last ${episodeCount} ${episodeLabel}.`
    ),
  async execute(interaction) {
    //   await interaction.reply({
    //     content: 'Your stats will be available after Friday\'s show.',
    //     flags: MessageFlags.Ephemeral
    //   });
    const userId = interaction.user.id;
    // Get user's top messages for last N episodes using kudos module
    const historyRows = getUserTopMessages(userId, episodeCount);
    await interaction.reply({
      content: "Fetching your stats...",
      flags: MessageFlags.Ephemeral,
    });
    // Build plain text output
    let reply = `**Your Top Messages (Last ${episodeCount} ${episodeLabel}):**\n`;
    for (const entry of historyRows) {
      let link = "";
      if (interaction.guild) {
        let foundChannel = null;
        for (const channel of interaction.guild.channels.cache.values()) {
          if (channel.isTextBased()) {
            try {
              const msg = await channel.messages.fetch(entry.message_id);
              if (msg) {
                foundChannel = channel;
                break;
              }
            } catch (e) {}
          }
        }
        if (foundChannel) {
          link = `https://discord.com/channels/${interaction.guild.id}/${foundChannel.id}/${entry.message_id}`;
        }
      }
      reply += `\n• **${entry.episode}** — ${entry.votes} point${
        entry.votes === 1 ? "" : "s"
      }${link ? ` ([link](${link}))` : ""}`;
    }
    await interaction.editReply({
      content: reply,
      flags: MessageFlags.Ephemeral,
    });
  },
};
