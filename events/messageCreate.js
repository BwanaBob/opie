const {
  Events,
  SlashCommandStringOption,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (
      message.content.match(
        /\b(opie|1041050338775539732|1046068702396825674)\b/gi
      )
    ) {
      message.react("👋");
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      //console.log(`${uniDate}`)
      //client.user.setActivity('with yarn', { type: ActivityType.Playing });
      console.log(
        `[${uniDate}] ✅ OPIE| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | said Opie`
      );
    }

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

    if (message.attachments.size !== 0 || message.embeds.length !== 0) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      const lastTime = message.client.timers.get(message.member.id);
      const gifDelay = message.client.rules.get("gifdelay");
      if (lastTime == undefined) {
        console.log(
          `[${uniDate}] ✅ EMB | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | First Embed`
        );
        message.client.timers.set(message.member.id, message.createdTimestamp);
      } else {
        const elapsed = Math.trunc(
          (message.createdTimestamp - lastTime) / 1000
        );
        if (elapsed < gifDelay) {
          console.log(
            `[${uniDate}] ⛔ EMB | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${elapsed}sec BAD`
          );
          message.delete();

          // send notice to user
          message.author.send(
            `\`\`\`ansi\n` +
              `The server \u001b[1;37m${message.guild.name}\u001b[0m has limited the posting of embedded content to once every \u001b[1;37m${gifDelay}\u001b[0m seconds.\`\`\``
          );
          // send notice to servers notice channel
          // publicUpdatesChannel = Community Updates
          // systemChannel = System Messages (New users)
          message.client.channels.cache
            .get(message.guild.publicUpdatesChannelId)
            .send(
              `\`\`\`ansi\n` +
                `⛔ Rule: \u001b[1;37mEmbed Timer\u001b[0m\n` +
                `⛔ User: \u001b[1;37m${message.member.displayName} (${message.author.tag})\u001b[0m\n` +
                `⛔ Channel: \u001b[1;37m${message.channel.name}\u001b[0m\n\`\`\``
            );
          // also send everything to bot's notice channel
          message.client.channels.cache
            .get("1045327770592497694")
            .send(
              `\`\`\`ansi\n` +
                `⛔ Server: \u001b[1;37m${message.guild.name}\u001b[0m\n` +
                `⛔ Rule: \u001b[1;37mEmbed Timer\u001b[0m\n` +
                `⛔ User: \u001b[1;37m${message.member.displayName} (${message.author.tag})\u001b[0m\n` +
                `⛔ Channel: \u001b[1;37m${message.channel.name}\u001b[0m\`\`\``
            );
          // "<t:${Math.round(message.createdTimestamp /1000)}>"
        } else {
          console.log(
            `[${uniDate}] ✅ EMB | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${elapsed}sec OK`
          );
          message.client.timers.set(
            message.member.id,
            message.createdTimestamp
          );
        }
      }
    }

    if (
      message.content.match(
        /\b(another|many|more|extra)\W.*?\b(break|breaks|ad|ads|commercial|commercials|advert|adverts|advertisement|advertisements|break|breaks)\b/gi
      )
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      message.react("😠");
      console.log(
        `[${uniDate}] 😠 ADS | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag})`
      );

      // send notice to servers notice channel
      message.client.channels.cache
        .get(message.guild.publicUpdatesChannelId)
        .send(
          `\`\`\`ansi\n` +
            `😠 Rule: \u001b[1;37mMore Ads\u001b[0m\n` +
            `😠 User: \u001b[1;37m${message.member.displayName} (${message.author.tag})\u001b[0m\n` +
            `😠 Channel: \u001b[1;37m${message.channel.name}\u001b[0m\n\`\`\``
        );

      // also send everything to bot's notice channel
      message.client.channels.cache
        .get("1045327770592497694")
        .send(
          `\`\`\`ansi\n` +
            `😠 Server: \u001b[1;37m${message.guild.name}\u001b[0m\n` +
            `😠 Rule: \u001b[1;37mMore Ads\u001b[0m\n` +
            `😠 User: \u001b[1;37m${message.member.displayName} (${message.author.tag})\u001b[0m\n` +
            `😠 Channel: \u001b[1;37m${message.channel.name}\u001b[0m\`\`\``
        );
    }
  },
};
