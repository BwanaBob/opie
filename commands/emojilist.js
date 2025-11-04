const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojilist")
    .setDescription("List all emojis with role restrictions and their associated roles")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions),
  
  async execute(interaction) {
    // Check permissions
    if (!interaction.member?.permissions?.has(PermissionFlagsBits.ManageGuildExpressions)) {
      return await interaction.reply({ 
        content: "❌ You don't have permission to manage emojis.", 
        flags: MessageFlags.Ephemeral 
      });
    }

    try {
      // Defer reply since this might take a moment
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      // Fetch all guild emojis and roles to ensure they're in cache
      await interaction.guild.emojis.fetch();
      await interaction.guild.roles.fetch();
      
      // Filter emojis that have role restrictions
      const lockedEmojis = interaction.guild.emojis.cache.filter(emoji => 
        emoji.roles && emoji.roles.cache.size > 0
      );

      if (lockedEmojis.size === 0) {
        return await interaction.editReply({ 
          content: "✅ No emojis currently have role restrictions in this server." 
        });
      }

      // Build the embed
      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`🔒 Locked Emojis (${lockedEmojis.size})`)
        .setDescription(`Emojis with role restrictions in **${interaction.guild.name}**`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.displayName}` });

      // Add fields for each locked emoji
      let fieldCount = 0;
      const maxFields = 25; // Discord embed limit

      for (const [emojiId, emoji] of lockedEmojis) {
        if (fieldCount >= maxFields) break;

        // Get role names (no mentions to avoid pings)
        const roleNames = emoji.roles.cache.map(role => {
          const guildRole = interaction.guild.roles.cache.get(role.id);
          return guildRole ? guildRole.name : `Unknown Role (${role.id})`;
        }).join(', ') || 'No roles found';
        const roleCount = emoji.roles.cache.size;
        
        const emojiDisplay = emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`;
        
        // Check if bot can use this emoji (has required roles)
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
        const botCanUseEmoji = emoji.roles.cache.some(role => botMember.roles.cache.has(role.id)) || emoji.roles.cache.size === 0;
        
        let fieldName, fieldValue;
        if (botCanUseEmoji) {
          fieldName = `${emojiDisplay} ${emoji.name}`;
          fieldValue = `**Roles (${roleCount}):** ${roleNames}`;
        } else {
          fieldName = `🔒 ${emoji.name} (restricted)`;
          fieldValue = `**Roles (${roleCount}):** ${roleNames}`;
        }
        
        embed.addFields({
          name: fieldName,
          value: fieldValue,
          inline: false
        });

        fieldCount++;
      }

      // If there are more emojis than we can display
      if (lockedEmojis.size > maxFields) {
        embed.addFields({
          name: "⚠️ Notice",
          value: `Only showing first ${maxFields} emojis. Total locked emojis: ${lockedEmojis.size}`,
          inline: false
        });
      }

      await interaction.editReply({ embeds: [embed] });

      // Log the action
      const logDate = new Date().toLocaleString();
      console.log(
        `[${logDate}] 📋 EMOJI | ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.member.displayName} (${interaction.user.tag}) | Listed ${lockedEmojis.size} locked emojis`
      );

    } catch (error) {
      console.error('Error in emojilist command:', error);
      const errorMessage = "⛔ An error occurred while trying to fetch emoji information.";
      
      if (interaction.deferred) {
        await interaction.editReply({ content: errorMessage });
      } else {
        await interaction.reply({ content: errorMessage, flags: MessageFlags.Ephemeral });
      }
    }
  },
};