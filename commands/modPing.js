// This should be a server specific command. Needs work.
const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("modping")
        .setDescription("Toggle reddit mod queue pings")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const roleToAssign = interaction.guild.roles.cache.get("1171955876609937564"); // Reddit Mod Queue role
        // const roleToAssign = interaction.guild.roles.cache.get("391837678967980035"); // Dev Server Reddit Mod Queue role
        if (roleToAssign) {
            const isMember = interaction.member.roles.cache.has(roleToAssign.id);
            var roleStatus = "Unknown"
            if (!isMember) {
                roleStatus = "on "
                interaction.member.roles.add(roleToAssign)
                    // .then(() => console.log(`Assigned: ${interaction.user.tag}`))
                    .catch(error => console.error(`ERROR: Assigning role to ${interaction.user.tag}: ${error.message} `))
            } else {
                roleStatus = "off"
                interaction.member.roles.remove(roleToAssign)
                    // .then(() => console.log(`Removed: ${interaction.user.tag}`))
                    .catch(error => console.error(`ERROR: Removing role from ${interaction.user.tag}: ${error.message} `))
            }
        }

        await interaction.reply({ 
            content: `Toggled pings: ${roleStatus}`, 
            flags: MessageFlags.Ephemeral 
        });
        // const commandExecutedDate = new Date().toLocaleString();
        // console.log(`[${commandExecutedDate}] ⌛ CMD   | Mod Ping: ${roleStatus} | Role Toggled ${interaction.user.tag}`);
    },
};
