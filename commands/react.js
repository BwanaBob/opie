const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, AttachmentBuilder, messageLink } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("react")
        .setDescription("React to a message with an emoji")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('Id of the message')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('emoji_name')
                .setDescription('Name of the emoji')
                .setRequired(true)
        ),
    async execute(interaction) {
        const reactMessage = interaction.options.getString('message_id') ?? 'post_none';
        const reactEmoji = interaction.options.getString('emoji_name') ?? 'post_none';

        interaction.channel.messages.fetch(reactMessage)
            .then(m => {
                m.react(reactEmoji)
                .catch(err => { console.error(`[ERROR] Reacting to message - `, err.message); });
            })
            .catch(err => { console.error(`[ERROR] Fetching message - `, err.message); });

        await interaction.reply({ content: `Reacted to message: ${reactMessage} with emoji: ${reactEmoji}`, ephemeral: true })
            .catch(err => { console.error(`[ERROR] Relpying to command ${message.id} -`, err.message); });
    },
};

