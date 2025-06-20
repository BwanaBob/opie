const { match } = require("assert");
const {
  Events,
  PermissionsBitField,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

const { OpenAIApi } = require("openai");

const options = require("../options.json");

function nextMilestone(currentCount) {
  const milestonesArray = [10, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900,
    1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
    10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
    100000, 150000, 200000, 250000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
    1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000];
  // Ensure milestonesArray is sorted in ascending order
  milestonesArray.sort((a, b) => a - b);

  // Iterate through milestones to find the next or currently met milestone
  for (let milestone of milestonesArray) {
    if (currentCount <= milestone) {
      return milestone;
    }
  }

  // If all milestones are reached, return the last milestone
  return milestonesArray[milestonesArray.length - 1];
}

// Helper function to get the notification channel
function getNotificationChannel(guild) {
  // Try to find a channel named "notifications-opie"
  const opieChannel = guild.channels.cache.find(
    (ch) => ch.name === "notifications-opie" && ch.type === 0 // 0 = GuildText
  );
  if (opieChannel) return opieChannel;
  // Fallback to publicUpdatesChannelId
  return guild.channels.cache.get(guild.publicUpdatesChannelId);
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

    let isAIChatMessage = false;

    // AI reply test
    if (message.reference && message.type === 19) { // Only treat as reply, not pin/forward
      const repliedMessage = await message.fetchReference();
      if (
        repliedMessage.author.id == message.client.user.id &&
        message.client.params.get("chatGPTEnabled") === "true"
      ) {
        isAIChatMessage = true;
      }
    }

    // AI command
    if (
      message.mentions.has(message.client.user) &&
      message.client.params.get("chatGPTEnabled") === "true"
    ) {
      isAIChatMessage = true;
    }

    if (isAIChatMessage) {
      const logDate = new Date(message.createdTimestamp).toLocaleString();
      console.log(
        `[${logDate}] 🤖 AICHAT| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag})`
      );
      const openai = require('../modules/openaiChat.js');
      const aiReply = await openai(message);
      if (!aiReply.undefined && aiReply !== 'ERR') {
        if (aiReply.length > 2000) {
          aiEmbed = new EmbedBuilder()
            .setColor(options.embeds.aiResponse.color)
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
          PermissionsBitField.Flags.ManageGuildExpressions
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
          PermissionsBitField.Flags.ManageGuildExpressions
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
    if ((message.type == 7) || (message.content == "test milestone" && message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
    ) {
      const nextMilestoneUserCount = nextMilestone(message.guild.memberCount);
      if (nextMilestoneUserCount == message.guild.memberCount || message.content == "test milestone") {
        const futureMilestoneUserCount = nextMilestone(message.guild.memberCount + 1);
        const milestoneEmbed = new EmbedBuilder()
          .setColor(options.embeds.milestone.color)
          .setTitle(`${message.guild.memberCount} Members!`)
          .setDescription(`**${message.guild.name}** has just reached a new milestone.\nThank you all for building such a lively community!`)
          .addFields({
            name: "Members",
            value: `${message.guild.memberCount}`,
            inline: true,
          })
          .addFields({
            name: "Next Milestone",
            value: `${futureMilestoneUserCount}`,
            inline: true,
          })
          .setThumbnail(message.guild.iconURL());
        const postChannel = message.guild.channels.cache.find(channel => channel.name === "announcements") || message.guild.channels.cache.find(channel => channel.name === "lounge") || message.guild.channels.cache.find(channel => channel.name === "lobby") || message.guild.channels.cache.find(channel => channel.name === "general") || message.client.channels.cache.get(message.guild.publicUpdatesChannelId)
        const postPingRole = message.guild.roles.cache.find(role => role.name === "Server News") || "Unknown"
        if (postPingRole == "Unknown") {
          postChannel.send({ embeds: [milestoneEmbed] })
            .catch(err => { console.error(`[ERROR] Posting message ${message.id} -`, err.message); });
        } else {
          postChannel.send({ content: `<@&${postPingRole.id}>`, embeds: [milestoneEmbed] })
            .catch(err => { console.error(`[ERROR] Posting message ${message.id} -`, err.message); });
        }
        const logDate = new Date(message.createdTimestamp).toLocaleString();
        console.log(
          `[${logDate}] 🏆 MILSTN| ${message.guild.name} | ${message.guild.memberCount}/${nextMilestoneUserCount} | ${message.member.displayName} (${message.author.tag}) | Milestone!`
        );

      } else {
        const logDate = new Date(message.createdTimestamp).toLocaleString();
        console.log(
          `[${logDate}] 👤 MEMBER| ${message.guild.name} | ${message.guild.memberCount}/${nextMilestoneUserCount} | ${message.member.displayName} (${message.author.tag}) | Added`
        );
      }
    }

    // Server Boosted Message Detection
    const messageTypes = [8, 9, 10, 11]; // Server boosted message types
    if ((messageTypes.includes(message.type))
      || (message.content == "test boosted" && message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
    ) {
      const serverBoostedImage = new AttachmentBuilder("./resources/thumb-boosted.png", { name: "thumb-boosted.png" });
      const serverBoostedEmbed = new EmbedBuilder()
        .setColor(options.embeds.serverBoosted.color)
        .setTitle(options.embeds.serverBoosted.title)
        .setThumbnail("attachment://thumb-boosted.png")
        .setAuthor({
          name: `${message.member.displayName}`,
          iconURL: `${message.member.displayAvatarURL()}`,
        })
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
        });
      const postChannel = message.guild.channels.cache.find(channel => channel.name === "announcements") || message.guild.channels.cache.find(channel => channel.name === "lounge") || message.guild.channels.cache.find(channel => channel.name === "lobby") || message.guild.channels.cache.find(channel => channel.name === "general") || message.client.channels.cache.get(message.guild.publicUpdatesChannelId)
      const postPingRole = message.guild.roles.cache.find(role => role.name === "Server News") || "Unknown"
        if(postPingRole == 'Unknown'){
          postChannel.send({ embeds: [serverBoostedEmbed], files: [serverBoostedImage] })
          .catch(err => { console.error(`[ERROR] Posting message ${message.id} -`, err.message); });
          postChannel.send(`Thank you, <@${message.author.id}>!`)
          .catch(err => { console.error(`[ERROR] Posting message ${message.id} -`, err.message); });
        } else {
          postChannel.send({ content: `<@&${postPingRole.id}>`, embeds: [serverBoostedEmbed], files: [serverBoostedImage] })
          .catch(err => { console.error(`[ERROR] Posting message ${message.id} -`, err.message); });
          postChannel.send(`Thank you, <@${message.author.id}>!`)
          .catch(err => { console.error(`[ERROR] Posting message ${message.id} -`, err.message); });
        }

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
          "bingo",
          "firearms",
          "food",
          "fur-babies",
          "memes",
          "notifications-opie",
          "notifications-automod",
          "notifications-discord",
          "notifications-github",
          "other-topics",
          "sports",
          "technology",
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
          const timerViolatedImage = new AttachmentBuilder("./resources/thumb-timer.png", { name: "thumb-timer.png" });
          const timerViolatedUserEmbed = new EmbedBuilder()
            .setColor(options.embeds.timerViolatedUser.color)
            .setTitle(options.embeds.timerViolatedUser.title)
            .setThumbnail("attachment://thumb-timer.png")
            .setDescription(
              `This server has limited the posting of content with attachments to once every ${attachmentDelay} seconds.`
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

          message.author.send({ embeds: [timerViolatedUserEmbed], files: [timerViolatedImage] })
            .catch(err => {
              console.error(`[ERROR] Sending private message to ${message.author} -`, err.message);
            });

          // send notice to servers notice channel
          // publicUpdatesChannel = Community Updates
          // systemChannel = System Messages (New users)
          const timerViolatedEmbed = new EmbedBuilder()
            .setColor(options.embeds.timerViolated.color)
            .setTitle(options.embeds.timerViolated.title)
            .setThumbnail("attachment://thumb-timer.png")
            .setAuthor({
              name: `${message.member.displayName} (${message.author.tag})`,
              iconURL: `${message.member.displayAvatarURL()}`,
            })
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

          const notifyChannel = getNotificationChannel(message.guild);
          if (notifyChannel) {
            notifyChannel.send({ embeds: [timerViolatedEmbed], files: [timerViolatedImage] });
          } else {
            console.error("No suitable notification channel found for timer violation event.");
          }

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
