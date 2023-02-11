// This even only fires when partials are enabled.
// Enabling partials will require other events to be rewritten

const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  execute(member) {
      const uniDate = new Date().toLocaleString();
      console.log(
        `[${uniDate}] 😐 JOIN| ${member.guild.name} | ${member.user.tag} | ${member.nickname} -> ${newMember.nickname}`
        )
      const removedEmbed = new EmbedBuilder()
      .setColor(0x777777)
      .setTitle("Member Joined")
      .setAuthor({
        name: `${member.displayName} (${member.user.tag})`,
        iconURL: `${member.displayAvatarURL()}`,
      })
      .setThumbnail(
        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/htc/37/name-badge_1f4db.png"
      )
      .addFields({
        name: "Server",
        value: `${member.guild.name}`,
        inline: true,
      });

      member.client.channels.cache
      .get(oldMember.guild.publicUpdatesChannelId)
      .send({ embeds: [removeEmbed] });

    // also send everything to bot's notice channel
    member.client.channels.cache
      .get("1045327770592497694")
      .send({ embeds: [removeEmbed] });

  },
};
