const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberUpdate,
  execute(oldMember, newMember) {
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





      // oldMember.client.channels.cache
      //   .get(oldMember.guild.publicUpdatesChannelId)
      //   .send(
      //     `\`\`\`ansi\n` +
      //       `😐 Rule: \u001b[1;37mAlias Update\u001b[0m\n` +
      //       `😐 User: \u001b[1;37m${oldMember.user.tag}\u001b[0m\n` +
      //       `😐 From: \u001b[1;37m${oldMember.nickname}\u001b[0m\n` +
      //       `😐   To: \u001b[1;37m${newMember.nickname}\u001b[0m\`\`\``
      //   );

      // also send everything to bot's notice channel
      // oldMember.client.channels.cache
      //   .get("1045327770592497694")
      //   .send(
      //     `\`\`\`ansi\n` +
      //       `😐 Server: \u001b[1;37m${oldMember.guild.name}\u001b[0m\n` +
      //       `😐 Rule: \u001b[1;37mAlias Update\u001b[0m\n` +
      //       `😐 User: \u001b[1;37m${oldMember.user.tag}\u001b[0m\n` +
      //       `😐 From: \u001b[1;37m${oldMember.nickname}\u001b[0m\n` +
      //       `😐   To: \u001b[1;37m${newMember.nickname}\u001b[0m\`\`\``
      //   );
    }
  },
};
