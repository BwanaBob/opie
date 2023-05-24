const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("options")
    .setDescription("Displays the current bot options.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(param =>
      param.setName('parameter')
        .setDescription('The option to set')
        .setRequired(false)
        .addChoices(
          { name: 'Reactions Off', value: 'set_reactions_off' },
          { name: 'Reactions On',  value: 'set_reactions_on'  },
          { name: 'Chatbot Off',   value: 'set_chatbot_off' },
          { name: 'Chatbot On',    value: 'set_chatbot_on'  },
          { name: 'Announce Off',  value: 'set_announce_off' },
          { name: 'Announce On',   value: 'set_announce_on' },
          { name: 'Tweets Off',    value: 'set_tweets_off'   },
          { name: 'Tweets On',     value: 'set_tweets_on'   },
        ))
,
  async execute(interaction) {

    const setParam = interaction.options.getString('parameter') ?? 'set_none';
    switch(setParam){
      case "set_reactions_off" : {
        interaction.client.params.set("messageReactionsEnabled", 'false');
      }
      break;
      case "set_reactions_on" : {
        interaction.client.params.set("messageReactionsEnabled", 'true');
      }
      break;
      case "set_chatbot_off" : {
        interaction.client.params.set("chatGPTEnabled", 'false');
      }
      break;
      case "set_chatbot_on" : {
        interaction.client.params.set("chatGPTEnabled", 'true');
      }
      break;
      case "set_announce_off" : {
        interaction.client.params.set("chatGPTAnnouncementsEnabled", 'false');
      }
      break;
      case "set_announce_on" : {
        interaction.client.params.set("chatGPTAnnouncementsEnabled", 'true');
      }
      break;
      case "set_tweets_off" : {
        interaction.client.params.set("twitterStreamEnabled", 'false');
      }
      break;
      case "set_tweets_on" : {
        interaction.client.params.set("twitterStreamEnabled", 'true');
      }
      break;
    }

    const attachmentDelay = interaction.client.params.get("attachmentDelay") ?? "Undefined";
    const messageReactionsEnabled = interaction.client.params.get("messageReactionsEnabled") ?? "Undefined";
    const chatbotChatEnabled = interaction.client.params.get("chatGPTEnabled") ?? "Undefined";
    const chatbotAnnounementsEnabled = interaction.client.params.get("chatGPTAnnouncementsEnabled") ?? "Undefined";
    const twitterStreamEnabled = interaction.client.params.get("twitterStreamEnabled") ?? "Undefined";
    
    const optionsEmbed = new EmbedBuilder()
    .setColor(0xe655d4)
    .setTitle(`Bot Options`)
    .setDescription(`Options controlling OPie's behavior.`)
    .addFields({
      name: "Attachments Delay",
      value: attachmentDelay,
      inline: false,
    })
    .addFields({
      name: "Message Reactions Enabled",
      value: messageReactionsEnabled,
      inline: false,
    })
    .addFields({
      name: "Chatbot Chat Enabled",
      value: chatbotChatEnabled,
      inline: false,
    })
    .addFields({
      name: "Chatbot Announcements Enabled",
      value: chatbotAnnounementsEnabled,
      inline: false,
    })
    .addFields({
      name: "Twitter Stream Enabled",
      value: twitterStreamEnabled,
      inline: false,
    })
    await interaction.reply({ embeds: [optionsEmbed], ephemeral: true });
    // await interaction.reply({ content: `The user is: ${testVal}`, ephemeral: true });
  },
};
