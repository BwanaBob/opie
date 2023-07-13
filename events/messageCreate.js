const { match } = require("assert");
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

    // REACTIONS
    const messageReactionsEnabled = message.client.params.get("messageReactionsEnabled") ?? "Undefined";
    if (messageReactionsEnabled === 'true') {
      // Reaction Handler
      const matchingReactions = message.client.reactions.filter(react => new RegExp(react.regex, 'gmi').test(message.content))
      const logDate = new Date(message.createdTimestamp).toLocaleString();
      for (reaction of matchingReactions.values()) {
        console.log(
          `[${logDate}] ${reaction.logName}| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag})`
        );
        reaction.execute(message);
      }
    }


    // AI command
    if (message.content.match(
      /(\bOPie(,| ,)|<@1041050338775539732>|<@&1045554081848103007>)/gmi
    ) && message.client.params.get("chatGPTEnabled") === "true"
    ) {
      const logDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${logDate}] 🤖 AICHAT| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag})`
      );
      const openai = require('../modules/openaiChat.js');
      const aiReply = await openai(message);
      if (!aiReply.undefined && aiReply !== 'ERR') {
        if (aiReply.length > 2000) {
          aiEmbed = new EmbedBuilder()
            .setColor(0xe655d4)
            .setDescription(`${aiReply}`);
          message.reply({ embeds: [aiEmbed] })
            .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
          message.reply(aiReply)
            .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        }
      } else {
        message.reply("Sorry, my AI brain is a bit glitchy at the moment.")
          .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
      }
      return;
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
      let role1 = message.guild.roles.cache.find(role => role.name === "Moderator") || false
      let role2 = message.guild.roles.cache.find(role => role.name === "Bingo Moderator") || false

      if (emoji1 && emoji2 && role1 && role2) {
        try {
          emoji1.roles.add(role1.id)
          emoji1.roles.add(role2.id)
          emoji2.roles.add(role1.id)
          emoji2.roles.add(role2.id)
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
      const logDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${logDate}] 🤓 EMOJI | ${message.guild.id} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${emoji1.name} | ${emoji2.name}`
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
      const logDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${logDate}] 🤓 EMOJI | ${message.guild.id} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${emoji1.name} | ${emoji2.name}`
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
      const logDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${logDate}] 🏆 MILSTN| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | Milestone!`
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
      const logDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${logDate}] 🚀 BOOST | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | BOOSTED!`
      );
    }

    // Embed Timer: 
    if ((message.attachments.size !== 0 || message.embeds.length !== 0)
      && !(
        message.author.bot ||
        message.member.permissions.has(
          PermissionsBitField.Flags.ManageMessages
        ) ||
        [
          "announcements",
          "art",
          "food",
          "fur-babies",
          "notifications",
        ].includes(message.channel.name)
      )) {
      const logDate = new Date(message.createdTimestamp).toLocaleString();
      const lastTime = message.client.timers.get(message.member.id);
      const attachmentDelay = message.client.params.get("attachmentDelay");
      if (lastTime == undefined) {
        // console.log(
        //   `[${logDate}] ✅ EMB   | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | First Attachment`
        // );
        message.client.timers.set(message.member.id, message.createdTimestamp);
      } else {
        const elapsed = Math.trunc(
          (message.createdTimestamp - lastTime) / 1000
        );
        if (elapsed < attachmentDelay) {
          console.log(
            `[${logDate}] ⛔ ATTACH| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${elapsed}sec BAD`
          );
          message.delete()
            .catch(err => { console.error(`[ERROR] Deleting message ${message.id} -`, err.message); });

          // send notice to user
          const userReplyEmbed = new EmbedBuilder()
            .setColor(0xff9900)
            .setTitle("Attachments Timer Violated")
            .setDescription(
              `This server has limited the posting of content with attachments to once every ${attachmentDelay} seconds.`
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

          message.author.send({ embeds: [userReplyEmbed] })
            .catch(err => {
              console.error(`[ERROR] Sending private message to ${message.author} -`, err.message);
            });

          // send notice to servers notice channel
          // publicUpdatesChannel = Community Updates
          // systemChannel = System Messages (New users)
          const notificationEmbed = new EmbedBuilder()
            .setColor(0xff9900)
            .setTitle("Attachments Timer Violated")
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
          //   `[${logDate}] ✅ EMBED | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${elapsed}sec OK`
          // );
          message.client.timers.set(
            message.member.id,
            message.createdTimestamp
          );
        }
      }
    }
  },
};
