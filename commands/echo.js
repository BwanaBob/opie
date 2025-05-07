const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags, // Import MessageFlags
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("OPie repeats whatever you type.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option.setName("input").setDescription("The input to echo back")
    ),
  async execute(interaction) {
    const input = interaction.options.getString("input") ?? "I don't know what to say.";
    await interaction.reply({ 
      content: "Message sent", 
      flags: MessageFlags.Ephemeral // Use the named flag instead of ephemeral
    });
    await interaction.channel.send({ content: input });
  },
};
