const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojiunlock")
    .setDescription("Unlock emoji(s) by removing role restrictions")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('The emoji to unlock (emoji name without colons)')
        .setRequired(true)),
  
  async execute(interaction) {
    const emojiName = interaction.options.getString('emoji');

    // Check permissions
    if (!interaction.member?.permissions?.has(PermissionFlagsBits.ManageGuildExpressions)) {
      return await interaction.reply({ 
        content: "❌ You don't have permission to manage emojis.", 
        flags: MessageFlags.Ephemeral 
      });
    }

    try {
      // Fetch guild emojis
      await interaction.guild.emojis.fetch();
      
      // Find the emoji
      const emoji = interaction.guild.emojis.cache.find(emoji => emoji.name === emojiName);
      
      if (!emoji) {
        return await interaction.reply({ 
          content: `❌ Could not find emoji with name: \`${emojiName}\``, 
          flags: MessageFlags.Ephemeral 
        });
      }

      // Remove all role restrictions (set to empty array)
      await emoji.roles.set([]);

      await interaction.reply({ 
        content: `✅ Successfully unlocked emoji \`:${emojiName}:\` - removed all role restrictions`, 
        flags: MessageFlags.Ephemeral 
      });

      // Log the action
      const logDate = new Date().toLocaleString();
      console.log(
        `[${logDate}] 🔓 EMOJI | ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.member.displayName} (${interaction.user.tag}) | Unlocked ${emoji.name}`
      );

    } catch (error) {
      console.error('Error in emojiunlock command:', error);
      await interaction.reply({ 
        content: "⛔ An error occurred while trying to unlock the emoji.", 
        flags: MessageFlags.Ephemeral 
      });
    }
  },
};