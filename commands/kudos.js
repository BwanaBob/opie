const {
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");
const { tallyKudos } = require("../modules/kudos");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kudos")
    .setDescription("Run Kudos tally for a channel and time window.")
    // .setDMPermission(false)
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
    )
    .addChannelOption(option =>
      option.setName("moderator_channel")
        .setDescription("Moderator channel for results")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply({
      content: "Processing Kudos...",
      flags: MessageFlags.Ephemeral
    });

    const channel = interaction.options.getChannel("channel");
    const moderatorChannel = interaction.options.getChannel("moderator_channel");
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
    await tallyKudos(
      interaction.client,
      channel.id,
      startTime,
      endTime,
      moderatorChannel.id
    );

    await interaction.followUp({
      content: "Kudos tally complete! Results sent to moderator channel.",
      flags: MessageFlags.Ephemeral
    });
  },
};