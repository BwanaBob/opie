const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojilock")
    .setDescription("Lock emoji(s) to specific roles")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('The emoji to lock (emoji name without colons)')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role1')
        .setDescription('First role to allow access to the emoji')
        .setRequired(false))
    .addRoleOption(option =>
      option.setName('role2')
        .setDescription('Second role to allow access to the emoji')
        .setRequired(false))
    .addRoleOption(option =>
      option.setName('role3')
        .setDescription('Third role to allow access to the emoji')
        .setRequired(false)),
  
  async execute(interaction) {
    const emojiName = interaction.options.getString('emoji');
    const role1 = interaction.options.getRole('role1');
    const role2 = interaction.options.getRole('role2');
    const role3 = interaction.options.getRole('role3');

    // Check permissions
    if (!interaction.member?.permissions?.has(PermissionFlagsBits.ManageGuildExpressions)) {
      return await interaction.reply({ 
        content: "❌ You don't have permission to manage emojis.", 
        ephemeral: true 
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
          ephemeral: true 
        });
      }

      // Collect roles to add
      const rolesToAdd = [];
      if (role1) rolesToAdd.push(role1.id);
      if (role2) rolesToAdd.push(role2.id);
      if (role3) rolesToAdd.push(role3.id);

      if (rolesToAdd.length === 0) {
        return await interaction.reply({ 
          content: "❌ You must specify at least one role to lock the emoji to.", 
          ephemeral: true 
        });
      }

      // Add roles to emoji
      for (const roleId of rolesToAdd) {
        await emoji.roles.add(roleId);
      }

      const roleNames = rolesToAdd.map(roleId => {
        const role = interaction.guild.roles.cache.get(roleId);
        return role ? role.name : 'Unknown Role';
      }).join(', ');

      await interaction.reply({ 
        content: `✅ Successfully locked emoji \`:${emojiName}:\` to roles: ${roleNames}`, 
        ephemeral: true 
      });

      // Log the action
      const logDate = new Date().toLocaleString();
      console.log(
        `[${logDate}] 🔒 EMOJI | ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.member.displayName} (${interaction.user.tag}) | Locked ${emoji.name} to ${roleNames}`
      );

    } catch (error) {
      console.error('Error in emojilock command:', error);
      await interaction.reply({ 
        content: "⛔ An error occurred while trying to lock the emoji.", 
        ephemeral: true 
      });
    }
  },
};