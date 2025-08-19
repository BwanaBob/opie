const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { getUserTopMessages } = require("../modules/kudos");
const { buildUserHistoryEmbed } = require("../modules/userHistoryEmbed");
const options = require("../options.json");
const episodeCount = (options.modules && options.modules.kudos && options.modules.kudos.leaderboardEpisodes) ? options.modules.kudos.leaderboardEpisodes : 10;
const episodeLabel = episodeCount === 1 ? 'Episode' : 'Episodes';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("allstar")
    .setDescription("All-Star user commands")
    .addSubcommand(sub =>
      sub.setName("history")
        .setDescription(`Show your top messages and points for the last ${episodeCount} ${episodeLabel}.`)
    ),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === "history") {
      const userId = interaction.user.id;
      // Get user's top messages for last 10 episodes using kudos module
  const episodeCount = (options.modules && options.modules.kudos && options.modules.kudos.leaderboardEpisodes) ? options.modules.kudos.leaderboardEpisodes : 10;
  const historyRows = getUserTopMessages(userId, episodeCount);
  const episodeLabel = episodeCount === 1 ? 'Episode' : 'Episodes';
      await interaction.reply({
        content: 'Fetching your All-Star history...',
        flags: MessageFlags.Ephemeral
      });
      // Build links for each entry
      const historyWithLinks = [];
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
        historyWithLinks.push({ ...entry, link });
      }
      // Get display name
      let username = interaction.user.username;
      if (interaction.member && interaction.member.nickname) {
        username = interaction.member.nickname;
      }
      const embed = buildUserHistoryEmbed(username, historyWithLinks, {
        title: `${username}'s All-Star History`,
        description: `Your top messages for the last ${episodeCount} ${episodeLabel}.`,
      });
      await interaction.editReply({
        content: '',
        embeds: [embed],
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
