const { SlashCommandBuilder } = require("discord.js");

const bingoMessage = `Come play Bingo with us at [thatsabingo.com](https://www.thatsabingo.com)`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bingo")
    .setDescription("How do I play Bingo?")
    .setDMPermission(true),
  async execute(interaction) {
    await interaction.reply({ content: bingoMessage, ephemeral: true });
  },
};
