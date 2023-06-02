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
      message.channel.name == "art-corner"
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

    if (message.attachments.first()) {
      noticeEmbed.addFields({
        name: "Attachment",
        value: `${message.attachments.first()?.url || " "}`,
        inline: false,
      });
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
