const { SlashCommandBuilder } = require('discord.js');

const oplRules = `👮  Be Legal  👮

1️⃣  No piracy.
This includes asking for streams or providing links. Discussion of less-than-legal streams is not allowed in this server and will result in a ban with no further warning.

2️⃣  Do not interfere with EMS/FIRE/LEO personnel in an attempt to get on the show.
This is dangerous and illegal.`
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
