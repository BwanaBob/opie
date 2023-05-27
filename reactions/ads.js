const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "Ads",
    logName: "😠 ADS   ",
    regex: "\\b(another|many|more|lots of|we just had|damn|extra|commercial)\\b.{0,30}\\b(break|breaks|ad|ads|commercial|commercials|advert|adverts|advertisement|advertisements|break|breaks)\\b",
    async execute(message) {
        if (
            message.author.bot ||
            message.member.permissions.has(
                PermissionsBitField.Flags.ManageMessages
            ) ||
            message.channel.name == "notifications" ||
            message.channel.name == "art-corner"
        ) {
            return;
        } else {
            message.react('😠')

            // send notice to servers notice channel
            const advertsEmbed = new EmbedBuilder()
                .setColor(0x00ff99)
                .setAuthor({
                    name: `${message.member.displayName} (${message.author.tag})`,
                    iconURL: `${message.member.displayAvatarURL()}`,
                })
                .setTitle("Advertising Complaint")
                .setDescription(`${message.content}`)
                .setThumbnail(
                    "https://i.imgur.com/3FNiHMX.png"
                )
                .addFields({
                    name: "Channel",
                    value: `${message.channel.name}`,
                    inline: true,
                })
                .addFields({
                    name: "Server",
                    value: `${message.guild.name}`,
                    inline: true,
                });
            message.client.channels.cache
                .get(message.guild.publicUpdatesChannelId)
                .send({ embeds: [advertsEmbed] });

            // also send everything to bot's notice channel
            // message.client.channels.cache
            //   .get("1045327770592497694")
            //   .send({ embeds: [advertsEmbed] });




        }
    }
}