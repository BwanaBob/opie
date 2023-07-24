const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberUpdate,
  execute(oldMember, newMember) {
    if (typeof newMember !== 'undefined' && typeof oldMember !== 'undefined') {
      if (newMember.nickname && oldMember.nickname !== newMember.nickname) {
        const logDate = new Date().toLocaleString();
        console.log(
          `[${logDate}] 😐 NAME  | ${oldMember.guild.name} | ${oldMember.user.tag} | ${oldMember.nickname} -> ${newMember.nickname}`
        );
        const nameChangeEmbed = new EmbedBuilder()
          .setColor(0x00aaaa)
          .setTitle("Server Alias Changed")
          .setAuthor({
            name: `${newMember.displayName} (${newMember.user.tag})`,
            iconURL: `${newMember.displayAvatarURL()}`,
          })
          .setThumbnail(
            "https://i.imgur.com/lSTK0Iq.png"
          )
          .addFields({
            name: "Previous Alias",
            value: `${oldMember.nickname}`,
            inline: true,
          })
          .addFields({
            name: "Server",
            value: `${oldMember.guild.name}`,
            inline: true,
          });

        oldMember.client.channels.cache
          .get(oldMember.guild.publicUpdatesChannelId)
          .send({ embeds: [nameChangeEmbed] });

        // also send everything to bot's notice channel
        oldMember.client.channels.cache
          .get("1045327770592497694")
          .send({ embeds: [nameChangeEmbed] });
      }

      // ROLE Changes
      if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        const roleRemovedLogDate = new Date().toLocaleString();
        const roleRemovedEmbed = new EmbedBuilder()
          .setColor(0x00aaaa)
          .setAuthor({
            name: `${newMember.displayName} (${newMember.user.tag})`,
            iconURL: `${newMember.displayAvatarURL()}`,
          })
          .addFields({
            name: "Server",
            value: `${newMember.guild.name}`,
            inline: true,
          });
        oldMember.roles.cache.forEach(role => {
          if (!newMember.roles.cache.has(role.id)) {
            roleRemovedEmbed.addFields({ name: "Role Removed", value: role.name });
            console.log(
              `[${roleRemovedLogDate}] 🔒 ROLE- | ${oldMember.guild.name} | ${oldMember.user.tag} | ${role.name}`
            );
          }
        });
        // // Send to bot's notice channel
        // newMember.client.channels.cache
        //   .get("1045327770592497694")
        //   .send({ embeds: [roleRemovedEmbed] });
        // Send to members guild notice channel
        newMember.client.channels.cache
          .get(newMember.guild.publicUpdatesChannelId)
          .send({ embeds: [roleRemovedEmbed] });
      } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const roleAddedLogDate = new Date().toLocaleString();
        const roleAddedEmbed = new EmbedBuilder()
          .setColor(0x00aaaa)
          .setAuthor({
            name: `${newMember.displayName} (${newMember.user.tag})`,
            iconURL: `${newMember.displayAvatarURL()}`,
          })
          .addFields({
            name: "Server",
            value: `${newMember.guild.name}`,
            inline: true,
          });
        newMember.roles.cache.forEach(role => {
          if (!oldMember.roles.cache.has(role.id)) {
            roleAddedEmbed.addFields({ name: "Role Added", value: role.name });
            console.log(
              `[${roleAddedLogDate}] 🔓 ROLE+ | ${oldMember.guild.name} | ${oldMember.user.tag} | ${role.name}`
            );
          }
        });
        // // // Send to bot's notice channel
        // newMember.client.channels.cache
        //   .get("1045327770592497694")
        //   .send({ embeds: [roleAddedEmbed] });
        // Send to members guild notice channel
        newMember.client.channels.cache
          .get(newMember.guild.publicUpdatesChannelId)
          .send({ embeds: [roleAddedEmbed] });
      }
    }
  },
};
