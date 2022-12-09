const { SlashCommandBuilder } = require('discord.js');

const oplRules = `Rules can be found in the #rules channel`
const oplRuleMessage1 = `1048680902923915264`
const oplRuleMessage2 = `1048680902923915264`
const oplRuleMessage3 = `1048680902923915264`

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Replies with Rules.'),
	async execute(interaction) {
		await interaction.reply({ content: oplRules, ephemeral: true });
	},
};
