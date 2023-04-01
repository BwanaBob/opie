const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const rulesEmbed = new EmbedBuilder()
.setColor(0xD45231)
.setTitle("Rules")
.setDescription(`Visit the #rules channel to read our complete list of server rules.`)
.addFields({
  name: "Channel",
  value: `<#1000869946215120987>`,
  inline: true,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Replies with Rules.")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.reply({ embeds: [rulesEmbed], ephemeral: true });
  },
};
