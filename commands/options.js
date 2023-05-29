const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("options")
        .setDescription("Displays the current bot options.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    ,
    async execute(interaction) {
        const attachmentDelay = interaction.client.params.get("attachmentDelay") ?? "Undefined";
        const messageReactionsEnabled = interaction.client.params.get("messageReactionsEnabled") ?? "Undefined";
        const chatbotChatEnabled = interaction.client.params.get("chatGPTEnabled") ?? "Undefined";
        const chatbotAnnounementsEnabled = interaction.client.params.get("chatGPTAnnouncementsEnabled") ?? "Undefined";
        const twitterStreamEnabled = interaction.client.params.get("twitterStreamEnabled") ?? "Undefined";

        var delay30Style = ButtonStyle.Secondary
        var delay60Style = ButtonStyle.Secondary
        var delay90Style = ButtonStyle.Secondary
        var delay120Style = ButtonStyle.Secondary
        var delay300Style = ButtonStyle.Secondary
        var reactStyle = ButtonStyle.Secondary
        var chatStyle = ButtonStyle.Secondary
        var announceStyle = ButtonStyle.Secondary
        var twitterStyle = ButtonStyle.Secondary

        if (attachmentDelay === '30') { delay30Style = ButtonStyle.Success }
        if (attachmentDelay === '60') { delay60Style = ButtonStyle.Success }
        if (attachmentDelay === '90') { delay90Style = ButtonStyle.Success }
        if (attachmentDelay === '120') { delay120Style = ButtonStyle.Success }
        if (attachmentDelay === '300') { delay300Style = ButtonStyle.Success }
        if (messageReactionsEnabled === 'true') { reactStyle = ButtonStyle.Success }
        if (chatbotChatEnabled === 'true') { chatStyle = ButtonStyle.Success }
        if (chatbotAnnounementsEnabled === 'true') { announceStyle = ButtonStyle.Success }
        if (twitterStreamEnabled === 'true') { twitterStyle = ButtonStyle.Success }

        const delay30 = new ButtonBuilder()
            .setCustomId('delay30')
            .setLabel('Delay 30')
            .setStyle(delay30Style);
        const delay60 = new ButtonBuilder()
            .setCustomId('delay60')
            .setLabel('Delay 60')
            .setStyle(delay60Style);
        const delay90 = new ButtonBuilder()
            .setCustomId('delay90')
            .setLabel('Delay 90')
            .setStyle(delay90Style);
        const delay120 = new ButtonBuilder()
            .setCustomId('delay120')
            .setLabel('Delay 120')
            .setStyle(delay120Style);
        const delay300 = new ButtonBuilder()
            .setCustomId('delay300')
            .setLabel('Delay 300')
            .setStyle(delay300Style);
        const react = new ButtonBuilder()
            .setCustomId('react')
            .setLabel('Reactions')
            .setStyle(reactStyle);
        const chat = new ButtonBuilder()
            .setCustomId('chat')
            .setLabel('AI Chat')
            .setStyle(chatStyle);
        const announce = new ButtonBuilder()
            .setCustomId('announce')
            .setLabel('Announcements')
            .setStyle(announceStyle);
        const twitter = new ButtonBuilder()
            .setCustomId('twitter')
            .setLabel('Twitter')
            .setStyle(twitterStyle);

        const delayRow = new ActionRowBuilder()
            .addComponents(delay30, delay60, delay90, delay120, delay300);
        const optionsRow = new ActionRowBuilder()
            .addComponents(react, chat, announce, twitter);

        await interaction.reply({
            content: `Adjust the bot's behavior here.`,
            components: [delayRow, optionsRow],
            //  embeds: [optionsEmbed],
            ephemeral: false
        });
        // await interaction.reply({ content: `The user is: ${testVal}`, ephemeral: true });
    },
};
