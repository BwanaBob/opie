const {
  Events,
  SlashCommandStringOption,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    //this has a flaw. member id is the same as user id. emojis from a particular server will fail on other servers
    if (
      message.content.match(
        /\b(opie|1041050338775539732|1046068702396825674)\b/gi
      )
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      //client.user.setActivity('with yarn', { type: ActivityType.Playing });
      console.log(
        `[${uniDate}] ✅ OPIE| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | said Opie`
      );

      var reaction = "👋";
      if (message.guild.id == "325206992413130753") {
        const reactions = {
          default: "👋",
          member: {
            "348629137080057878": `<:arctic_fox:1057115452553314354>`, // bwana
            "629681401918390312": [
              `<a:purple_heart_beating:1038193897337270352>`,
              `<a:sloth_animated:1038514444289978479>`,
            ], // barre
            "511074631239598080": `<a:waving_hand_wave:1038212554515816518>`, // ferret
            "342487311860367362": "🔨", // wub
            "440328038337478657": `<:sausage_thumbs_up:1039959562553401445>`, // saucy
            "475145905117593623": `<:suspicious_fry:1027310519910154330>`, // china
            "368797989554356224": `<:cowheart:705960794101383258>`, // cow
          },
        };
        const memberReaction =
          reactions.member[message.member.id] || reactions.default;
        if (Array.isArray(memberReaction)) {
          reaction =
            memberReaction[Math.floor(Math.random() * memberReaction.length)];
        } else {
          reaction = memberReaction;
        }
      }
      message.react(reaction);
    }

    if (
      message.guild.id == "325206992413130753" &&
      message.content.match(/\b(happy\Wnew\Wyear)\b/gi)
    ) {
      const reactions = [
        "🥳",
        "🎉",
        "🥂",
        "🎆",
        "🎇",
        "🎊",
        `<a:partying:1040138276692033556>`,
        `<a:party_blob:1038194657848463370>`,
        `<a:party_popper:1038207072485003274>`,
        `<a:bottle_with_popping_cork:1056931540283699282>`,
        `<a:firework:1010870326667788298>`,
        `<a:cat_jump:1040302608813924415>`,
        `<a:confetti_ball_animated:1056947556241903636>`,
      ];
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      message.react(reaction);
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      //console.log(`${uniDate}`)
      //client.user.setActivity('with yarn', { type: ActivityType.Playing });
      console.log(
        `[${uniDate}] ✅ NYE | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | New Year`
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
        /\b(another|many|more|lots of|we just had|damn|extra|commercial)\W.*?\b(break|breaks|ad|ads|commercial|commercials|advert|adverts|advertisement|advertisements|break|breaks)\b/gi
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
