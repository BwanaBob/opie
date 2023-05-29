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
      const usedCommand = interaction.message.interaction.commandName;
      // console.log(messageComponents);
      // console.log(buttonName);
      // console.log(usedCommand);

      const uniDate = new Date().toLocaleString();

      switch (buttonName) {
        case "announce": {
          if (chatbotAnnounementsEnabled === "true") {
            interaction.client.params.set("chatGPTAnnouncementsEnabled", 'false');
            // interaction.reply("Announcements Off");
            console.log(
              `[${uniDate}] 🔘 ANOUNC| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Announcements Off`
            );
          } else {
            interaction.client.params.set("chatGPTAnnouncementsEnabled", 'true');
            // interaction.reply("Announcements On");
            console.log(
              `[${uniDate}] 🔘 ANOUNC| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Announcements On`
            );
          }
        }
          break;
        case "chat": {
          if (chatbotChatEnabled === "true") {
            interaction.client.params.set("chatGPTEnabled", 'false');
            // interaction.reply("AI Chat Off");
            console.log(
              `[${uniDate}] 🔘 AICHAT| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | AI Chat Off`
            );
          } else {
            interaction.client.params.set("chatGPTEnabled", 'true');
            // interaction.reply("AI Chat On");
            console.log(
              `[${uniDate}] 🔘 AICHAT| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | AI Chat On`
            );
          }
          // interaction.message.delete();
        }
          break;
        case "react": {
          if (messageReactionsEnabled === "true") {
            interaction.client.params.set("messageReactionsEnabled", 'false');
            // interaction.reply("Reactions Off");
            console.log(
              `[${uniDate}] 🔘 REACTS| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Reactions Off`
            );
          } else {
            interaction.client.params.set("messageReactionsEnabled", 'true');
            // interaction.reply("Reactions On");
            console.log(
              `[${uniDate}] 🔘 REACTS| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Reactions On`
            );
          }
          // interaction.message.delete();
        }
          break;
        case "twitter": {
          if (twitterStreamEnabled === "true") {
            interaction.client.params.set("twitterStreamEnabled", 'false');
            // interaction.reply("Twitter Off");
            console.log(
              `[${uniDate}] 🔘 TWITER| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Twitter Off`
            );
          } else {
            interaction.client.params.set("twitterStreamEnabled", 'true');
            // interaction.reply("Twitter On");
            console.log(
              `[${uniDate}] 🔘 TWITER| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Twitter On`
            );
          }
          // interaction.message.delete();
        }
          break;
        case "delay30": {
          interaction.client.params.set("attachmentDelay", '30');
          // interaction.reply("Attachment delay set to 30 seconds.");
          console.log(
            `[${uniDate}] 🔘 DLAY30| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Delay 30`
          );
          // interaction.message.delete();
        }
          break;
        case "delay60": {
          interaction.client.params.set("attachmentDelay", '60');
          // interaction.reply("Attachment delay set to 60 seconds.");
          console.log(
            `[${uniDate}] 🔘 DLAY60| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Delay 60`
          );
          // interaction.message.delete();
        }
          break;
        case "delay90": {
          interaction.client.params.set("attachmentDelay", '90');
          // interaction.reply("Attachment delay set to 90 seconds.");
          console.log(
            `[${uniDate}] 🔘 DLAY90| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Delay 90`
          );
          // interaction.message.delete();
        }
          break;
        case "delay120": {
          interaction.client.params.set("attachmentDelay", '120');
          // interaction.reply("Attachment delay set to 120 seconds.");
          console.log(
            `[${uniDate}] 🔘 DLAY2m| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Delay 120`
          );
          // interaction.message.delete();
        }
          break;
        case "delay300": {
          interaction.client.params.set("attachmentDelay", '300');
          // interaction.reply("Attachment delay set to 300 seconds.");
          console.log(
            `[${uniDate}] 🔘 DLAY5m| ${interaction.member.guild.name} | ${interaction.message.channel.name} | ${interaction.user.username} | Delay 300`
          );
          // interaction.message.delete();
        }
          break;
      }
      if (usedCommand === "options") {
        const optionsComponents = await getOptionsComponents(interaction.client);
        // console.log(optionsComponents);
        await interaction.update({
          //content: `Adjust the bot's behavior here.`,
          components: optionsComponents,
        });

      }
    }
  },
};
