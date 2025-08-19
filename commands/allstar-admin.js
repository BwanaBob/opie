const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { tallyAndStoreReactions, getLeaderboard, deleteReactionsForEpisode, getRecentEpisodes } = require("../modules/kudos");
const { sendKudosLeaderboardText } = require("../modules/kudosEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("star")
    .setDescription("All-Star moderator tools")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(sub =>
      sub.setName("tally")
        .setDescription("Tally and store all upvote reactions for a channel, time window, and episode name.")
        .addChannelOption(option =>
          option.setName("channel")
            .setDescription("Channel to process")
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName("start")
            .setDescription("Start date/time (YYYY-MM-DD HH:mm)")
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName("end")
            .setDescription("End date/time (YYYY-MM-DD HH:mm)")
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName("episode")
            .setDescription("Episode name (e.g. S1E1, Finale)")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName("leaderboard")
        .setDescription("Display the All-Star leaderboard for recent episodes.")
        .addStringOption(option =>
          option.setName("episodes")
            .setDescription("Comma-separated list of episodes, or a number for N most recent episodes (e.g. 5 or S01E01,S01E02)")
            .setRequired(true)
        )
        .addChannelOption(option =>
          option.setName("channel")
            .setDescription("Channel to display leaderboard in (defaults to this channel)")
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub.setName("delete-episode")
        .setDescription("Delete all stored reactions for a given episode.")
        .addStringOption(option =>
          option.setName("episode")
            .setDescription("Episode name to delete (e.g. S1E1, Finale)")
            .setRequired(true)
        )
    )
    // Leaderboard blacklist management
    .addSubcommand(sub =>
      sub.setName("board-blacklist-add")
        .setDescription("Add a user to the leaderboard blacklist.")
        .addUserOption(option =>
          option.setName("user")
            .setDescription("User to blacklist")
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName("reason")
            .setDescription("Reason for blacklist")
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub.setName("board-blacklist-remove")
        .setDescription("Remove a user from the leaderboard blacklist.")
        .addUserOption(option =>
          option.setName("user")
            .setDescription("User to remove from blacklist")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName("board-blacklist-view")
        .setDescription("View the leaderboard blacklist.")
    )
    // Voter blacklist management
    .addSubcommand(sub =>
      sub.setName("voter-blacklist-add")
        .setDescription("Add a user to the voter blacklist.")
        .addUserOption(option =>
          option.setName("user")
            .setDescription("User to blacklist from voting")
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName("reason")
            .setDescription("Reason for blacklist")
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub.setName("voter-blacklist-remove")
        .setDescription("Remove a user from the voter blacklist.")
        .addUserOption(option =>
          option.setName("user")
            .setDescription("User to remove from voter blacklist")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName("voter-blacklist-view")
        .setDescription("View the voter blacklist.")
    ),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === "tally") {
      await interaction.reply({
        content: "Processing All-Star tally...",
        flags: MessageFlags.Ephemeral
      });
      const channel = interaction.options.getChannel("channel");
      const start = interaction.options.getString("start");
      const end = interaction.options.getString("end");
      const episode = interaction.options.getString("episode");
      const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
      if (!dateRegex.test(start) || !dateRegex.test(end)) {
        await interaction.followUp({
          content: "Error: Dates must be in format YYYY-MM-DD HH:mm.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }
      const startTime = new Date(start.replace(' ', 'T') + ':00Z');
      const endTime = new Date(end.replace(' ', 'T') + ':00Z');
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        await interaction.followUp({
          content: "Error: Invalid date/time values.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }
      if (startTime >= endTime) {
        await interaction.followUp({
          content: "Error: Start time must be before end time.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }
      const storedCount = await tallyAndStoreReactions(
        interaction.client,
        channel.id,
        startTime,
        endTime,
        episode
      );
      await interaction.followUp({
        content: `All-Star tally complete! ${storedCount} reactions stored for channel <#${channel.id}> for episode '${episode}'.`,
        flags: MessageFlags.Ephemeral
      });
    } else if (sub === "leaderboard") {
      const episodesRaw = interaction.options.getString("episodes");
      let episodes;
      if (/^\d+$/.test(episodesRaw.trim())) {
        const n = parseInt(episodesRaw.trim(), 10);
        episodes = getRecentEpisodes(n);
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
      let desc;
      if (episodes.length === 1) {
        desc = `_Top contributors for episode: ${episodes[0]}_`;
      } else {
        desc = `_Top contributors for the last ${episodes.length} episodes_`;
      }
      await sendKudosLeaderboardText(channel, leaderboard, {
        title: `**All-Star Leaderboard**`,
        description: desc,
      });
      await interaction.reply({
        content: `Leaderboard sent to <#${channel.id}>!`,
        flags: MessageFlags.Ephemeral
      });
    } else if (sub === "delete-episode") {
      const episode = interaction.options.getString("episode");
      const deleted = deleteReactionsForEpisode(episode);
      await interaction.reply({
        content: `Deleted ${deleted} reactions for episode '${episode}'.`,
        flags: MessageFlags.Ephemeral
      });
    }
    // Leaderboard blacklist
    else if (sub === "board-blacklist-add") {
      const user = interaction.options.getUser("user");
      const userId = user.id;
      const reason = interaction.options.getString("reason") || null;
      const addedBy = interaction.user.id;
      require("../modules/kudosDb").addLeaderboardBlacklist(userId, reason, addedBy);
      await interaction.reply({
        content: `User \\<@${userId}> (${user.tag}) added to leaderboard blacklist.${reason ? " Reason: " + reason : ""}`,
        flags: MessageFlags.Ephemeral
      });
    }
    else if (sub === "board-blacklist-remove") {
      const user = interaction.options.getUser("user");
      const userId = user.id;
      require("../modules/kudosDb").removeLeaderboardBlacklist(userId);
      await interaction.reply({
        content: `User \\<@${userId}> (${user.tag}) removed from leaderboard blacklist.`,
        flags: MessageFlags.Ephemeral
      });
    }
    else if (sub === "board-blacklist-view") {
      const rows = require("../modules/kudosDb").db.prepare("SELECT user_id, reason, added_by, added_at FROM allstar_leaderboard_blacklist").all();
      if (!rows.length) {
        await interaction.reply({ content: "Leaderboard blacklist is empty.", flags: MessageFlags.Ephemeral });
        return;
      }
      const msg = "**Leaderboard Blacklist:**\n" + rows.map(r => {
        return `• <@${r.user_id}> (added by <@${r.added_by}> on <t:${r.added_at}:d> <t:${r.added_at}:t>${r.reason ? ", reason: " + r.reason : ""})`;
      }).join("\n");
      await interaction.reply({ content: msg, flags: MessageFlags.Ephemeral });
    }
    // Voter blacklist
    else if (sub === "voter-blacklist-add") {
      const user = interaction.options.getUser("user");
      const userId = user.id;
      const reason = interaction.options.getString("reason") || null;
      const addedBy = interaction.user.id;
      require("../modules/kudosDb").addVoterBlacklist(userId, reason, addedBy);
      await interaction.reply({
        content: `User \\<@${userId}> (${user.tag}) added to voter blacklist.${reason ? " Reason: " + reason : ""}`,
        flags: MessageFlags.Ephemeral
      });
    }
    else if (sub === "voter-blacklist-remove") {
      const user = interaction.options.getUser("user");
      const userId = user.id;
      require("../modules/kudosDb").removeVoterBlacklist(userId);
      await interaction.reply({
        content: `User \\<@${userId}> (${user.tag}) removed from voter blacklist.`,
        flags: MessageFlags.Ephemeral
      });
    }
    else if (sub === "voter-blacklist-view") {
      const rows = require("../modules/kudosDb").db.prepare("SELECT user_id, reason, added_by, added_at FROM allstar_voter_blacklist").all();
      if (!rows.length) {
        await interaction.reply({ content: "Voter blacklist is empty.", flags: MessageFlags.Ephemeral });
        return;
      }
      const msg = "**Voter Blacklist:**\n" + rows.map(r => {
        return `• <@${r.user_id}> (added by <@${r.added_by}> on <t:${r.added_at}:d> <t:${r.added_at}:t>${r.reason ? ", reason: " + r.reason : ""})`;
      }).join("\n");
      await interaction.reply({ content: msg, flags: MessageFlags.Ephemeral });
    }
  }
};
