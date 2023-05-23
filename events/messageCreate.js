const {
  Events,
  PermissionsBitField,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

const { OpenAIApi } = require("openai");

function milestone(members) {
  const membersString = String(members);
  const membersExponent = membersString.length - 1;
  const firstChar = membersString[0];
  const nextMilestone = (Number(firstChar) + 1) * (10 ** membersExponent)
  return nextMilestone;
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) { return; }

    // AI command
    if (message.content.match(
      /^(opie,\W)/gi
    ) && message.client.params.get("chatGPTEnabled") == "true"
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${uniDate}] 🤖 AI  | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag})`
      );

      const openai = require('../modules/openaiChat.js');
      const aiReply = await openai(message);
      if (!aiReply.undefined && aiReply !== 'ERR') {
        message.reply(aiReply);
      } else { message.reply("Sorry, my AI brain is a bit glitchy at the moment.") }
      return;
    }

    if (
      message.content.match(
        /\b(opie|1041050338775539732|1046068702396825674)\b/gi
      )
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
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
            "511074631239598080": [
              `<:ferret:1079139863544201224>`,
              `<a:blue_heart_beating:1040127801879179354>`,
            ], // ferret
            "342487311860367362": "🔨", // wub
            "440328038337478657": `<:sausage_thumbs_up:1039959562553401445>`, // saucy
            "475145905117593623": [`<:suspicious_fry:1027310519910154330>`, `🏹`, `❤️`], // china
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
      console.log(
        `[${uniDate}] ✅ NYE | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | New Year`
      );
    }

    // Cow
    if (
      message.guild.id == "325206992413130753" &&
      message.content.match(/\b(cow|cows|368797989554356224)\b/gi)
    ) {
      const reactions = [
        '<:cowcop:705958276210360391>',
        '<:cowcowboypensive:705961325695729754>',
        '<:cowheart:705960794101383258>',
        '<:cowmad:705961134930526289>',
        '<:cowsad:705960912732946492>',
        '<a:cowsiren:705958068361625611>',
        '<:cowsleep:705961477877530715>',
        '<:cowwink:705961033298346004>',
      ];
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      message.react(reaction);
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${uniDate}] 🐮 COW | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Cow`
      );
    }

    // Dinosaur
    if (
      message.content.match(/\b(dino|dinos|dinosaur|dinosaurs)\b/gi)
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      message.react(`🦕`);
      console.log(
        `[${uniDate}] 🦕 DINO| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Dinosaur`
      );
    }

    // Easter
    if (
      message.content.match(/(happy).(easter)/gi)
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      message.react(`🐰`);
      console.log(
        `[${uniDate}] 🐰 ESTR| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Easter`
      );
    }

    // Good Kitty
    if (
      message.content.match(/(good|great|best|wonderful|pretty).(kitty|cat|kitten|feline)/gi)
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      message.react(`😻`);
      console.log(
        `[${uniDate}] 😻 CAT | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Good Kitty`
      );
    }

    // Good Bot
    if (
      message.content.match(/(Good Bot)/gi)
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      message.react(`🥰`);
      console.log(
        `[${uniDate}] 🥰 BOT | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Good Bot`
      );
    }

    // Bad Bot
    if (
      message.content.match(/(Bad Bot)/gi)
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      message.react(`😢`);
      console.log(
        `[${uniDate}] 😢 BAD | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Bad Bot`
      );
    }

    // Taser
    if (
      message.content.match(
        /(taser|tased)/gi
      )
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      message.react(`⚡`);
      console.log(
        `[${uniDate}] ⚡ ZAP | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Taser`
      );
    }

    // Peacock
    if (
      message.content.match(
        /(peacock)/gi
      )
    ) {
      if (message.guild.id == "325206992413130753") {
        message.react(`<:NBC_peacock:1086865895709753404>`);
      } else {
        message.react(`🦚`);
      }
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${uniDate}] 🦚 PCOK| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Peacock`
      );
    }

    // here we go
    if (
      message.content.match(
        /(here we go)/gi
      )
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      message.react(`🚨`);
      console.log(
        `[${uniDate}] 🚨 GO  | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | We Go`
      );
    }

    // 2 beers
    if (
      message.content.match(
        /(2 beer|two beer)/gi
      )
    ) {
      if (message.guild.id == "325206992413130753") {
        message.react(`<a:two_beer_mugs:1038932370352521406>`);
      } else {
        message.react(`🍻`);
      }
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${uniDate}] 🍻 ALE | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | 2 Beers`
      );
    }

    // POOPH
    if (
      message.content.match(
        /(pooph|poopf)/gi
      )
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      if (message.guild.id == "325206992413130753") {
        message.react(`<:poop_and_flowers:1070396627887603874>`);
      } else {
        message.react(`💩`);
      }
      console.log(
        `[${uniDate}] 💩 POO | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Pooph`
      );
    }

    // BINGO
    if (
      message.content.match(
        /(bingo)/gi
      )
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      if (message.guild.id == "325206992413130753") {
        message.react(`<:bingo:1066838689814163466>`);
      } else {
        message.react(`🎱`);
      }
      console.log(
        `[${uniDate}] 🎱 BNGO| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Bingo`
      );
    }

    // Jaws of Life
    if (
      message.content.match(
        /(jaws of life)/gi
      )
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      if (message.guild.id == "325206992413130753") {
        message.react(`<:jaws_of_life:1093940607732416623>`);
      } else {
        message.react(`🔧`);
      }
      console.log(
        `[${uniDate}] 🔧 JoL | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Jaws of Life`
      );
    }

    // Jaws (not of Life)
    if (
      message.content.match(
        /jaws(?! of life)/gi
      )
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      if (message.guild.id == "325206992413130753") {
        message.react(`<:jaws:1093958471394791617>`);
      } else {
        message.react(`🦈`);
      }
      console.log(
        `[${uniDate}] 🦈 Jaws| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Jaws`
      );
    }

    // How do I play Bingo?
    if (
      message.content.match(
        /(how|where).*(find|play|get).*(bingo|card)/gmi
      )
    ) {
      const bingoEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Bingo")
        .setDescription("Get your bingo cards and play with us live!")
        .addFields({
          name: "Website",
          value: `[thatsabingo.com](https://www.thatsabingo.com/)`,
          inline: true,
        })
        .setURL('https://www.thatsabingo.com/')
        .setThumbnail(
          "https://i.imgur.com/dJP9d8L.png"
        );

      message.reply({ embeds: [bingoEmbed] });
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${uniDate}] 🤘 HOW | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Bingo`
      );
    }

    // POOP Flowers
    if (
      message.content.match(
        /(poop(\W|_).*flowers)/gi
      )
    ) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      if (message.guild.id == "325206992413130753") {
        message.react(`<:pooph:1073752699914420244>`);
      } else {
        message.react(`👃`);
      }
      console.log(
        `[${uniDate}] 👃 P&F | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag})`
      );
    }

    // Buff out
    if (
      message.content.match(
        /(Buff Out)/gi
      ) && message.author.tag == "Sausageslinger11#3264"
    ) {
      // message.channel.send(`🚗 Come on down to ${message.member}'s car repair shop! Everything can be buffed out! 🚗`);
      const image = new AttachmentBuilder('https://i.imgur.com/gF0aNsT.png');
      message.reply({ files: [image] })

      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${uniDate}] 🚗 BUF | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Buff Out`
      );
    }

    // Emoji Lock
    // Temp holder for future command
    if (message.content.match(/(emojilock)/gi)) {
      if (
        !message.member.permissions.has(
          PermissionsBitField.Flags.ManageEmojisAndStickers
        )
      ) {
        return
      }
      message.guild.emojis.fetch();
      let emoji1 = message.guild.emojis.cache.find(emoji => emoji.name === "confirm_check_ball") || false
      let emoji2 = message.guild.emojis.cache.find(emoji => emoji.name === "reject_cross_ball") || false
      let role = message.guild.roles.cache.find(role => role.name === "Moderator") || false

      if (emoji1 && emoji2 && role) {
        try {
          emoji1.roles.add(role.id)
          emoji2.roles.add(role.id)
          //emoji1.roles.set([])
          //emoji2.roles.set([])
          message.react(`✅`);
        }
        catch (error) {
          message.react(`⛔`);
        }
      } else {
        message.react(`🤓`);
      }
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${uniDate}] 🤓 TST | ${message.guild.id} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${emoji1.name} | ${emoji2.name}`
      );
    }

    // Emoji unLock
    // Temp holder for future command
    if (message.content.match(/(emojiunlock)/gi)) {
      if (
        !message.member.permissions.has(
          PermissionsBitField.Flags.ManageEmojisAndStickers
        )
      ) {
        return
      }
      message.guild.emojis.fetch();
      let emoji1 = message.guild.emojis.cache.find(emoji => emoji.name === "confirm_check_ball") || false
      //      console.log(emoji1)
      let emoji2 = message.guild.emojis.cache.find(emoji => emoji.name === "reject_cross_ball") || false
      //      console.log(emoji2)
      //      let role = message.guild.roles.cache.find(role => role.name === "Bingo Moderator") || false
      //      console.log(role)

      if (emoji1 && emoji2) {
        try {
          //emoji1.roles.add(role.id)
          //emoji2.roles.add(role.id)
          emoji1.roles.set([])
          emoji2.roles.set([])
          message.react(`✅`);
        }
        catch (error) {
          message.react(`⛔`);
        }
      } else {
        message.react(`🤓`);
      }
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${uniDate}] 🤓 TST | ${message.guild.id} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${emoji1.name} | ${emoji2.name}`
      );
    }

    // Member Added Message Detection
    if ((message.type == 7 && message.guild.memberCount >= message.guild.nextUserCount)
      || (message.content == "test milestone" && message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
    ) {
      message.guild.nextUserCount = milestone(message.guild.memberCount);
      const milestoneEmbed = new EmbedBuilder()
        .setColor(0xe655d4)
        .setTitle(`${message.guild.memberCount} Members!`)
        .setDescription(`${message.guild.name} has just reached a new milestone.\nThank you all for building such a lively community!`)
        .addFields({
          name: "Members",
          value: `${message.guild.memberCount}`,
          inline: true,
        })
        .addFields({
          name: "Next Milestone",
          value: `${message.guild.nextUserCount}`,
          inline: true,
        })
        .setThumbnail(message.guild.iconURL());
      //.setImage("https://i.imgur.com/OyZvh4R.jpg");
      const postChannel = message.guild.channels.cache.find(channel => channel.name === "lounge") || message.guild.channels.cache.find(channel => channel.name === "lobby") || message.guild.channels.cache.find(channel => channel.name === "general") || message.client.channels.cache.get(message.guild.publicUpdatesChannelId)
      postChannel.send({ embeds: [milestoneEmbed] });
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${uniDate}] 🏆 MILE| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Milestone!`
      );
    }

    // Server Boosted Message Detection
    const messageTypes = [8, 9, 10, 11]; // Server boosted message types
    if ((messageTypes.includes(message.type))
      || (message.content == "test boosted" && message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
    ) {
      const boostedEmbed = new EmbedBuilder()
        .setColor(0xe655d4)
        .setAuthor({
          name: `${message.member.displayName}`,
          iconURL: `${message.member.displayAvatarURL()}`,
        })
        .setTitle("Boosted the server!")
        .setDescription(`<@${message.member.id}> has just boosted the server. Please thank them for their awesome support of our community!`)
        .addFields({
          name: "Server Level",
          value: `${message.guild.premiumTier}`,
          inline: true,
        })
        .addFields({
          name: "Boosts",
          value: `${message.guild.premiumSubscriptionCount}`,
          inline: true,
        })
        .setThumbnail(
          "https://i.imgur.com/RNBLHif.png"
        );
      const postChannel = message.guild.channels.cache.find(channel => channel.name === "lounge") || message.guild.channels.cache.find(channel => channel.name === "lobby") || message.guild.channels.cache.find(channel => channel.name === "general") || message.client.channels.cache.get(message.guild.publicUpdatesChannelId)
      postChannel.send({ embeds: [boostedEmbed] });
      postChannel.send(`Thank you, <@${message.author.id}>!`)
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${uniDate}] 🚀 BST | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | BOOSTED!`
      );
    }

    // exempt mods from the following restrictions
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

    // Embed Timer: 
    if (message.attachments.size !== 0 || message.embeds.length !== 0) {
      const uniDate = new Date(message.createdTimestamp).toLocaleString();
      const lastTime = message.client.timers.get(message.member.id);
      const attachmentDelay = message.client.params.get("attachmentDelay");
      if (lastTime == undefined) {
        // console.log(
        //   `[${uniDate}] ✅ EMB | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | First Embed`
        // );
        message.client.timers.set(message.member.id, message.createdTimestamp);
      } else {
        const elapsed = Math.trunc(
          (message.createdTimestamp - lastTime) / 1000
        );
        if (elapsed < attachmentDelay) {
          console.log(
            `[${uniDate}] ⛔ EMB | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${elapsed}sec BAD`
          );
          message.delete();

          // send notice to user
          const userReplyEmbed = new EmbedBuilder()
            .setColor(0xff9900)
            .setTitle("Embed Timer Violated")
            .setDescription(
              `This server has limited the posting of embedded content to once every ${attachmentDelay} seconds.`
            )
            .setThumbnail(
              "https://i.imgur.com/TgSIaZD.png"
            )
            .addFields({
              name: "Server",
              value: `${message.guild.name}`,
              inline: true,
            })
            .addFields({
              name: "Channel",
              value: `${message.channel.name}`,
              inline: true,
            });
          message.author.send({ embeds: [userReplyEmbed] });

          // send notice to servers notice channel
          // publicUpdatesChannel = Community Updates
          // systemChannel = System Messages (New users)
          const notificationEmbed = new EmbedBuilder()
            .setColor(0xff9900)
            .setTitle("Embed Timer Violated")
            .setAuthor({
              name: `${message.member.displayName} (${message.author.tag})`,
              iconURL: `${message.member.displayAvatarURL()}`,
            })
            .setThumbnail(
              "https://i.imgur.com/TgSIaZD.png"
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
            .send({ embeds: [notificationEmbed] });

          //// also send everything to bot's notice channel
          // message.client.channels.cache
          //   .get("1045327770592497694")
          //   .send({ embeds: [notificationEmbed] });
          //// "<t:${Math.round(message.createdTimestamp /1000)}>"
        } else {
          // console.log(
          //   `[${uniDate}] ✅ EMB | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${elapsed}sec OK`
          // );
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

  },
};
