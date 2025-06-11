const { Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const options = require("../options.json");

// Helper function to get the notification channel
function getNotificationChannel(guild) {
  // Try to find a channel named "notifications-opie"
  const opieChannel = guild.channels.cache.find(
    (ch) => ch.name === "notifications-opie" && ch.type === 0 // 0 = GuildText
  );
  if (opieChannel) return opieChannel;
  // Fallback to publicUpdatesChannelId
  return guild.channels.cache.get(guild.publicUpdatesChannelId);
}

module.exports = {
  name: Events.GuildMemberUpdate,
  execute(oldMember, newMember) {
    if (typeof newMember !== 'undefined' && typeof oldMember !== 'undefined') {
      if (newMember.nickname && oldMember.nickname !== newMember.nickname) {
        const logDate = new Date().toLocaleString();
        console.log(
          `[${logDate}] 😐 NAME  | ${oldMember.guild.name} | ${oldMember.user.tag} | ${oldMember.nickname} -> ${newMember.nickname}`
        );
        const nameChangeImage = new AttachmentBuilder("./resources/thumb-name.png", {name: "thumb-name.png"});
        const nameChangeEmbed = new EmbedBuilder()
          .setColor(options.embeds.nameChange.color)
          .setTitle(options.embeds.nameChange.title)
          .setThumbnail("attachment://thumb-name.png")
          .setAuthor({
            name: `${newMember.displayName} (${newMember.user.tag})`,
            iconURL: `${newMember.displayAvatarURL()}`,
          })
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

        // Send to notification channel
        const notifyChannel = getNotificationChannel(oldMember.guild);
        if (notifyChannel) {
          notifyChannel.send({ embeds: [nameChangeEmbed], files: [nameChangeImage] });
        } else {
          console.error("No suitable notification channel found for name change event.");
        }

        // also send everything to bot's notice channel (unchanged)
        oldMember.client.channels.cache
          .get("1045327770592497694")
          .send({ embeds: [nameChangeEmbed], files: [nameChangeImage] });
      }

      // ROLE Changes
      if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        const roleRemovedLogDate = new Date().toLocaleString();
        const roleRemovedEmbed = new EmbedBuilder()
          .setColor(options.embeds.roleRemoved.color)
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
        // Send to notification channel
        const notifyChannel = getNotificationChannel(newMember.guild);
        if (notifyChannel) {
          notifyChannel.send({ embeds: [roleRemovedEmbed] });
        } else {
          console.error("No suitable notification channel found for role removed event.");
        }
      } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const roleAddedLogDate = new Date().toLocaleString();
        const roleAddedEmbed = new EmbedBuilder()
          .setColor(options.embeds.roleAdded.color)
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
        // Send to notification channel
        const notifyChannel = getNotificationChannel(newMember.guild);
        if (notifyChannel) {
          notifyChannel.send({ embeds: [roleAddedEmbed] });
        } else {
          console.error("No suitable notification channel found for role added event.");
        }
      }
    }
  },
};
