const { Events, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    const logDate = new Date(message.createdTimestamp).toLocaleString();
    console.log(
      `[${logDate}] 🚮 DELETE| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Deleted`
    );

    if (
      message.author.bot ||
      message.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      ) ||
      message.channel.name == "notifications" ||
      message.channel.name == "art"
    ) {
      return;
    }

    const noticeEmbed = new EmbedBuilder()
      .setColor(0x9900ff)
      .setTitle("Had a message deleted")
      //  .setURL("https://discord.js.org/")
      .setAuthor({
        name: `${message.member.displayName} (${message.author.tag})`,
        iconURL: `${message.member.displayAvatarURL()}`,
      })
      .setThumbnail(
        "https://i.imgur.com/tr9aVAA.png"
      );

    if (message.content) {
      noticeEmbed.addFields({
        name: "Message",
        value: `${message.content || " "}`,
        inline: false,
      });
    }
    if (message.attachments.size !== 0) {
      const removedAttachmentURL = message.attachments.first()?.url || " ";
      const removedAttachmentType = message.attachments.first()?.contentType || " ";
      if (removedAttachmentType.includes('image/')) {
        noticeEmbed.setImage(removedAttachmentURL);
      } else {
        noticeEmbed.addFields({
          name: "Attachment",
          value: `${removedAttachmentURL}`,
          inline: false,
        });
      }
    }
    if (message.embeds.size !== 0) {
      var embedProvider = message.embeds[0]?.provider?.name ?? "";
      if (embedProvider == "Tenor") {
        var tenorThumbnail = message.embeds[0]?.thumbnail?.url ?? "";
        var tenorURL = message.embeds[0]?.url ?? "";
        const tenorGifURL = await fetch(`${tenorURL}.gif`)
          .then((response) => {
            return response.url;
          }) ?? "";
        if (tenorGifURL) {
          noticeEmbed.setImage(tenorGifURL);
        } else {
          noticeEmbed.setImage(tenorThumbnail);
        }
      }
    }
    noticeEmbed.addFields({
      name: "Channel",
      value: `${message.channel.name}`,
      inline: true,
    });
    noticeEmbed.addFields({
      name: "Server",
      value: `${message.guild.name}`,
      inline: true,
    });
    message.client.channels.cache
      .get(message.guild.publicUpdatesChannelId)
      .send({ embeds: [noticeEmbed] });
  },
};
