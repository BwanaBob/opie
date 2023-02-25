// This even only fires when partials are enabled.
// Enabling partials will require other events to be rewritten

const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberRemove,
  execute(GuildId, user) {
      const uniDate = new Date().toLocaleString();
      console.log(
        `[${uniDate}] 😐 LEFT| ${user.name}`
        )
      const removedEmbed = new EmbedBuilder()
      .setColor(0x777777)
      .setTitle("Member Left")
      .setAuthor({
        name: `${user.name}`,
      })
      member.client.channels.cache
      .get(oldMember.guild.publicUpdatesChannelId)
      .send({ embeds: [removedEmbed] });

    // also send everything to bot's notice channel
      member.client.channels.cache
      .get("1045327770592497694")
      .send({ embeds: [removedEmbed] });

  },
};
