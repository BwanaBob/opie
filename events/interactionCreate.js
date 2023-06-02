const { Events, Component } = require("discord.js");
const getOptionsComponents = require('../modules/optionsComponents.js');

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

      const logDate = new Date(interaction.createdTimestamp).toLocaleString();
      if (!interaction.guild) {
        console.log(
          `[${logDate}] 💻 COMAND| Private Message | ${interaction.user.tag} | ${interaction.commandName}`
        );
      } else {
        console.log(
          `[${logDate}] 💻 COMAND| ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.member.displayName} (${interaction.user.tag}) | ${interaction.commandName}`
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
      const usedCommand = interaction.message.interaction.commandName;
      // console.log(messageComponents);
      // console.log(buttonName);
      // console.log(usedCommand);

      const logDate = new Date().toLocaleString();

      switch (buttonName) {
        case "announce": {
          if (chatbotAnnounementsEnabled === "true") {
            interaction.client.params.set("chatGPTAnnouncementsEnabled", 'false');
            console.log(`[${logDate}] 🔘 ANOUNC| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Announcements Off`);
          } else {
            interaction.client.params.set("chatGPTAnnouncementsEnabled", 'true');
            console.log(`[${logDate}] 🔘 ANOUNC| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Announcements On`);
          }
        }
          break;
        case "chat": {
          if (chatbotChatEnabled === "true") {
            interaction.client.params.set("chatGPTEnabled", 'false');
            console.log(`[${logDate}] 🔘 AICHAT| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | AI Chat Off`);
          } else {
            interaction.client.params.set("chatGPTEnabled", 'true');
            console.log(`[${logDate}] 🔘 AICHAT| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | AI Chat On`);
          }
        }
          break;
        case "react": {
          if (messageReactionsEnabled === "true") {
            interaction.client.params.set("messageReactionsEnabled", 'false');
            console.log(`[${logDate}] 🔘 REACTS| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Reactions Off`);
          } else {
            interaction.client.params.set("messageReactionsEnabled", 'true');
            console.log(`[${logDate}] 🔘 REACTS| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Reactions On`);
          }
        }
          break;
        case "twitter": {
          if (twitterStreamEnabled === "true") {
            interaction.client.params.set("twitterStreamEnabled", 'false');
            console.log(`[${logDate}] 🔘 TWITER| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Twitter Off`);
          } else {
            interaction.client.params.set("twitterStreamEnabled", 'true');
            console.log(`[${logDate}] 🔘 TWITER| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Twitter On`);
          }
        }
          break;
        case "delay30": {
          interaction.client.params.set("attachmentDelay", '30');
          console.log(`[${logDate}] 🔘 DLAY30| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Delay 30`);
        }
          break;
        case "delay60": {
          interaction.client.params.set("attachmentDelay", '60');
          console.log(`[${logDate}] 🔘 DLAY60| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Delay 60`);
        }
          break;
        case "delay90": {
          interaction.client.params.set("attachmentDelay", '90');
          console.log(`[${logDate}] 🔘 DLAY90| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Delay 90`);
        }
          break;
        case "delay120": {
          interaction.client.params.set("attachmentDelay", '120');
          console.log(`[${logDate}] 🔘 DLAY2m| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Delay 120`);
        }
          break;
        case "delay300": {
          interaction.client.params.set("attachmentDelay", '300');
          console.log(`[${logDate}] 🔘 DLAY5m| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Delay 300`);
        }
          break;
      }
      if (usedCommand === "options") {
        const optionsComponents = await getOptionsComponents(interaction.client);
        await interaction.update({
          components: optionsComponents,
        });

      }
    }
  },
};
