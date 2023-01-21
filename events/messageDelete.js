const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    //    console.log("Message Deleted");

    // if (message.bot) {
    //   return;
    // }

    const noticeEmbed = new EmbedBuilder()
      .setColor(0x9900ff)
      .setTitle("Had a Message Deleted")
      //  .setURL("https://discord.js.org/")
      .setAuthor({
        name: `${message.member.displayName} (${message.author.tag})`,
        iconURL: `${message.member.displayAvatarURL()}`,
      })
      //      	.setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/319/no-entry_26d4.png')
      .setTimestamp()
      .setFooter({
        text: "Audit Log knows who deleted it",
        iconURL:
          "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/319/no-entry_26d4.png",
      });

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
      inline: false,
    });

    message.client.channels.cache
      .get(message.guild.publicUpdatesChannelId)
      .send({ embeds: [noticeEmbed] });
  },
};
