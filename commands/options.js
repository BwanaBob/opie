const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const getOptionsComponents = require('../modules/optionsComponents.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("options")
        .setDescription("Controls the current bot options.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    ,
    async execute(interaction) {
        const optionsComponents = await getOptionsComponents(interaction.client);
        let twitterLastKeepAlive = interaction.client.timers.get("TwitterKeepAlive");
        if (twitterLastKeepAlive) {
            twitterLastKeepAlive = "<t:" + twitterLastKeepAlive + ":R>"
        } else {
            twitterLastKeepAlive = "Never";
        }

        await interaction.reply({
            content: `## __Options controlling bot behavior__\n* **Delay:** How long in seconds a user must wait between posting attachments (gifs).\n* **Reactions**: Emoji reactions to certain phrases.\n* **AI Chat**: AI Responses to user input.\n* **Announcements**: Scheduled AI announcemnets.\n* **Twitter**: Posting of found tweets.\nLast Twitter Ping: ${twitterLastKeepAlive}`,
            components: optionsComponents,
            ephemeral: true
        });
    },
};
