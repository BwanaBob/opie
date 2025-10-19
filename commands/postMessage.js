const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
  ChannelType
} = require("discord.js");

const { postMessage } = require("../modules/featureHelper");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Post a message to a specified channel using the postMessage feature.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to post the message to")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message text to post")
        .setRequired(true)
    ),
    
  async execute(interaction) {
    try {
      const targetChannel = interaction.options.getChannel("channel");
      const messageText = interaction.options.getString("message");

      // Use the helper function to post the message
      const sentMessage = await postMessage(
        interaction.client,
        targetChannel.id,
        messageText
      );

      if (sentMessage) {
        await interaction.reply({
          content: `✅ Message successfully posted to ${targetChannel}`,
          flags: MessageFlags.Ephemeral
        });
      } else {
        await interaction.reply({
          content: "❌ Failed to post message. Check the logs for details.",
          flags: MessageFlags.Ephemeral
        });
      }

    } catch (error) {
      console.error("Error in post command:", error);
      await interaction.reply({
        content: "❌ An error occurred while processing the command.",
        flags: MessageFlags.Ephemeral
      });
    }
  },
};