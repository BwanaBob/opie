const { SlashCommandBuilder, ActivityType, PermissionFlagsBits, Client } = require("discord.js");
const { parse } = require("dotenv");
const statusReply = `Status Set`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Set OPie's status on Discord")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addStringOption(option =>
        option.setName('activity')
        .setDescription('Activity Type')
        .setRequired(true)
        .addChoices(
            { name: 'Watching',  value: 'status_watching'  },
            { name: 'Playing',   value: 'status_playing'   },
            { name: 'Listening', value: 'status_listening' },
//            { name: 'Streaming', value: 'status_streaming' },
            { name: 'Competing', value: 'status_competing' },
//            { name: 'Custom',    value: 'status_custom'    },
          )  
        )
        .addStringOption(option =>
            option.setName('text')
            .setDescription('Status text')
            .setRequired(true)
        ),
        async execute(interaction) {
        const activityType = interaction.options.getString('activity') ?? 'status_watching';
        const activityText = interaction.options.getString('text') ?? 'Nothing';
        var parsedType = ActivityType.Custom;

        switch (activityType) {
            case 'status_watching':
                parsedType = ActivityType.Watching;
                break;
            case 'status_playing':
                parsedType = ActivityType.Playing;
                break;
            case 'status_listening':
                parsedType = ActivityType.Listening;
              break;
            case 'status_streaming':
                parsedType = ActivityType.Streaming;
              break;
            case 'status_competing':
                parsedType = ActivityType.Competing;
          }

        let newStatus = {
            status: "online",
            activities: [
              {
                name: activityText,
                type: parsedType,
              },
            ],
        }
        interaction.client.user.setPresence(newStatus);
        await interaction.reply({ content: statusReply, ephemeral: true });
    },
};

