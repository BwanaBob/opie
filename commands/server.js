const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server.")
    .setDMPermission(false),
  async execute(interaction) {
    const verificationLevelNumber = interaction.guild.verificationLevel || 0;
    var verificationLeveText = "";
    switch (verificationLevelNumber) {
      case 0:
        verificationLeveText = "None";
        break;
      case 1:
        verificationLeveText = "Low";
        break;
      case 2:
        verificationLeveText = "Medium";
        break;
      case 3:
        verificationLeveText = "High";
        break;
      case 4:
        verificationLeveText = "Very High";
        break;
      default:
        verificationLeveText = "N/A";
    }
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
        name: "Boosts",
        value: `${interaction.guild.premiumSubscriptionCount}`,
        inline: true,
      })
      .addFields({
        name: "Boost Level",
        value: `${interaction.guild.premiumTier}`,
        inline: true,
      })
      .addFields({
        name: "Emojis",
        value: `${interaction.guild.emojis.cache.size}`,
        inline: true,
      })
      .addFields({
        name: "Stickers",
        value: `${interaction.guild.stickers.cache.size}`,
        inline: true,
      })
      .addFields({
        name: "Roles",
        value: `${interaction.guild.roles.cache.size}`,
        inline: true,
      })
      .addFields({
        name: "Discoverable",
        value: `${interaction.guild.features?.includes("DISCOVERABLE")}`,
        inline: true,
      })
      .addFields({
        name: "Community",
        value: `${interaction.guild.features?.includes("COMMUNITY")}`,
        inline: true,
      })
      // .addFields({
      //   name: "Featurable",
      //   value: `${interaction.guild.features?.includes("FEATURABLE")}`,
      //   inline: true,
      // })
      .addFields({
        name: "Verification Level",
        value: `${verificationLeveText}`,
        inline: true,
      })
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({ text: `Established: ${interaction.guild.createdAt}` });

    await interaction.reply({
      embeds: [serverEmbed],
      flags: MessageFlags.Ephemeral,
    });
  },
};
