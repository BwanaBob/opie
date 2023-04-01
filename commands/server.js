const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server.")
    .setDMPermission(false),
  async execute(interaction) {
    const serverEmbed = new EmbedBuilder()
    .setColor(0x55e6d4)
    .setTitle("Server Information")
    //.setDescription(`This server is ${interaction.guild.name}`)
    .addFields({
      name: "Name",
      value: `${interaction.guild.name}`,
      inline: false,
    })
    .addFields({
      name: "Members",
      value: `${interaction.guild.memberCount}`,
      inline: true,
    })
    .addFields({
      name: "Boost Level",
      value: `${interaction.guild.premiumTier}`,
      inline: true,
    })
    .addFields({
      name: "Boosts",
      value: `${interaction.guild.premiumSubscriptionCount}`,
      inline: true,
    })
    .setThumbnail(interaction.guild.iconURL())
    .setFooter({ text: `Established: ${interaction.guild.createdAt}`});

    await interaction.reply({
      embeds: [serverEmbed],
      ephemeral: true,
    });
  },
};
