const { SlashCommandBuilder, CommandInteractionOptionResolver } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')),
    async execute(interaction) {
        const input = interaction.options.getString('input') ?? 'No reason provided'
        await interaction.reply({ content: input, ephemeral: true });
    },
};
        