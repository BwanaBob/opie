const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { deleteReactionsForEpisode } = require("../modules/kudos");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kudos-delete-episode")
    .setDescription("Delete all stored reactions for a given episode.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option.setName("episode")
        .setDescription("Episode name to delete (e.g. S1E1, Finale)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const episode = interaction.options.getString("episode");
    const deleted = deleteReactionsForEpisode(episode);
    await interaction.reply({
      content: `Deleted ${deleted} reactions for episode '${episode}'.`,
      flags: MessageFlags.Ephemeral
    });
  }
};
