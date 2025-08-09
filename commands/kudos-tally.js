const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { tallyAndStoreReactions } = require("../modules/kudos");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kudos-tally")
    .setDescription("Tally and store all upvote reactions for a channel and time window.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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
    ),
  async execute(interaction) {
    await interaction.reply({
      content: "Processing Kudos tally...",
      flags: MessageFlags.Ephemeral
    });

    const channel = interaction.options.getChannel("channel");
    const start = interaction.options.getString("start");
    const end = interaction.options.getString("end");

    // Validate date format: YYYY-MM-DD HH:mm
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateRegex.test(start) || !dateRegex.test(end)) {
      await interaction.followUp({
        content: "Error: Dates must be in format YYYY-MM-DD HH:mm.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    // Parse dates
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

    // Run tally
    const storedCount = await tallyAndStoreReactions(
      interaction.client,
      channel.id,
      startTime,
      endTime
    );

    await interaction.followUp({
      content: `Kudos tally complete! ${storedCount} reactions stored for channel <#${channel.id}> in the given window.`,
      flags: MessageFlags.Ephemeral
    });
  }
};
