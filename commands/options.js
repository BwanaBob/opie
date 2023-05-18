const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("options")
    .setDescription("Displays the current bot options."),
  async execute(interaction) {
    const testVal = interaction.client.user.tag;

    const gifDelay = interaction.client.params.get("gifdelay") || "Undefined";
    const aiEnabled = interaction.client.params.get("chatGPTEnabled") || "Undefined";
    // const gifDelay = interaction.client.params.get("gifdelay") || "Undefined";

    const optionsEmbed = new EmbedBuilder()
    .setColor(0xe655d4)
    .setTitle(`Bot Options`)
    .setDescription(`Options controlling OPie's behavior.`)
    .addFields({
      name: "Embed Delay",
      value: gifDelay,
      inline: true,
    })
    .addFields({
      name: "AI Enabled",
      value: aiEnabled,
      inline: true,
    })
    await interaction.reply({ embeds: [optionsEmbed], ephemeral: true });
    // await interaction.reply({ content: `The user is: ${testVal}`, ephemeral: true });
  },
};
