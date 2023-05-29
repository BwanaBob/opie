const { Events, Component } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `⛔ No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      const uniDate = new Date(interaction.createdTimestamp).toLocaleString();
      if (!interaction.guild) {
        console.log(
          `[${uniDate}] 💻 COMAND| Private Message | ${interaction.user.tag} | ${interaction.commandName}`
        );
      } else {
        console.log(
          `[${uniDate}] 💻 COMAND| ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.member.displayName} (${interaction.user.tag}) | ${interaction.commandName}`
        );
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`⛔ Error executing ${interaction.commandName}`);
        console.error(error);
      }
    } else if (interaction.isButton()) {
      const messageReactionsEnabled = interaction.client.params.get("messageReactionsEnabled") ?? "Undefined";
      const chatbotChatEnabled = interaction.client.params.get("chatGPTEnabled") ?? "Undefined";
      const chatbotAnnounementsEnabled = interaction.client.params.get("chatGPTAnnouncementsEnabled") ?? "Undefined";
      const twitterStreamEnabled = interaction.client.params.get("twitterStreamEnabled") ?? "Undefined";

      //const messageComponents = interaction.message.components
      const buttonName = interaction.customId;
      // const usedCommand = interaction.message.interaction.commandName;
      // console.log(messageComponents);
      // console.log(buttonName);
      // console.log(usedCommand);
      switch (buttonName) {
        case "announce": {
          if (chatbotAnnounementsEnabled === "true") {
            interaction.client.params.set("chatGPTAnnouncementsEnabled", 'false');
            interaction.message.reply("Announcements Off");
          } else {
            interaction.client.params.set("chatGPTAnnouncementsEnabled", 'true');
            interaction.message.reply("Announcements On");
          }
          interaction.message.delete();
        }
          break;
        case "chat": {
          if (chatbotChatEnabled === "true") {
            interaction.client.params.set("chatGPTEnabled", 'false');
            interaction.message.reply("AI chat Off");
          } else {
            interaction.client.params.set("chatGPTEnabled", 'true');
            interaction.message.reply("AI chat On");
          }
          interaction.message.delete();
        }
          break;
        case "react": {
          if (messageReactionsEnabled === "true") {
            interaction.client.params.set("messageReactionsEnabled", 'false');
            interaction.message.reply("Reactions Off");
          } else {
            interaction.client.params.set("messageReactionsEnabled", 'true');
            interaction.message.reply("Reactions On");
          }
          interaction.message.delete();
        }
          break;
        case "twitter": {
          if (twitterStreamEnabled === "true") {
            interaction.client.params.set("twitterStreamEnabled", 'false');
            interaction.message.reply("Twitter Off");
          } else {
            interaction.client.params.set("twitterStreamEnabled", 'true');
            interaction.message.reply("Twitter On");
          }
          interaction.message.delete();
        }
          break;
        case "delay30": {
          interaction.client.params.set("attachmentDelay", '30');
          interaction.message.reply("Attachment delay set to 30 seconds.");
          interaction.message.delete();
        }
          break;
        case "delay60": {
          interaction.client.params.set("attachmentDelay", '60');
          interaction.message.reply("Attachment delay set to 60 seconds.");
          interaction.message.delete();
        }
          break;
        case "delay90": {
          interaction.client.params.set("attachmentDelay", '90');
          interaction.message.reply("Attachment delay set to 90 seconds.");
          interaction.message.delete();
        }
          break;
        case "delay120": {
          interaction.client.params.set("attachmentDelay", '120');
          interaction.message.reply("Attachment delay set to 120 seconds.");
          interaction.message.delete();
        }
          break;
        case "delay300": {
          interaction.client.params.set("attachmentDelay", '300');
          interaction.message.reply("Attachment delay set to 300 seconds.");
          interaction.message.delete();
        }
          break;
      }
    }
  },
};
