const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberUpdate,
  execute(oldMember, newMember) {
    if (typeof newMember !== 'undefined' && typeof oldMember !== 'undefined') {
      if (newMember.nickname && oldMember.nickname !== newMember.nickname) {
        const uniDate = new Date().toLocaleString();
        console.log(
          `[${uniDate}] 😐 NAME| ${oldMember.guild.name} | ${oldMember.user.tag} | ${oldMember.nickname} -> ${newMember.nickname}`
        );
        const nameChangeEmbed = new EmbedBuilder()
          .setColor(0x00aaaa)
          .setTitle("Server Alias Changed")
          .setAuthor({
            name: `${newMember.displayName} (${newMember.user.tag})`,
            iconURL: `${newMember.displayAvatarURL()}`,
          })
          .setThumbnail(
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/htc/37/name-badge_1f4db.png"
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
    }
  },
};
