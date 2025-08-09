const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { getVotersForMessage } = require("../modules/kudos");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kudos-votes")
    .setDescription("Show all voters for a specific message.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option.setName("message_id")
        .setDescription("The Discord message ID to check.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const messageId = interaction.options.getString("message_id");
    const voters = getVotersForMessage(messageId);
    if (!voters.length) {
      await interaction.reply({
        content: `No voters found for message ID: ${messageId}`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }
    const voterMentions = voters.map(v => `<@${v.voter_id}>`).join("\n");
    await interaction.reply({
      content: `Voters for message ID ${messageId} (may include duplicates if re-added):\n${voterMentions}`,
      flags: MessageFlags.Ephemeral
    });
  }
};
