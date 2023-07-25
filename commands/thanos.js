const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("thanos")
        .setDescription("Assign role to every user")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {

        const roleToAssign = interaction.client.guild.roles.cache.get("1133491149412241518"); // Member role
        // const roleToAssign = interaction.guild.roles.cache.get("392121688998936578"); // test role
        // console.log(roleToAssign);
        if (roleToAssign.name == 'Member') {
            const guildMembers = await interaction.guild.members.fetch();
            guildMembers.forEach(guildMember => {
                if (!guildMember.roles.cache.has(roleToAssign.id)) {
                    guildMember.roles.add(roleToAssign)
                        .then(() => console.log(`Assigned: ${guildMember.user.tag}`))
                        .catch(error => console.error(`ERROR: Assigning role to ${guildMember.user.tag}: ${error.message} `))
                }
            });
        }
        await interaction.reply({ content: "Pong!", ephemeral: true });
    },
};
