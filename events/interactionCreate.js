const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `⛔ No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    const uniDate = new Date(interaction.createdTimestamp).toLocaleString();
    if (!interaction.guild) {
      console.log(
        `[${uniDate}] 💻 CMD | Private Message | ${interaction.user.tag} | ${interaction.commandName}`
      );
    } else {
      console.log(
        `[${uniDate}] 💻 CMD | ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.member.displayName} (${interaction.user.tag}) | ${interaction.commandName}`
      );
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`⛔ Error executing ${interaction.commandName}`);
      console.error(error);
    }
  },
};
