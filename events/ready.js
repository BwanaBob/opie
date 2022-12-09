const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        var startDate = new Date();
        console.log(`[${startDate.toLocaleString()}]  Logged in as: ${client.user.username} (${client.user.tag})`)
        console.log(`Member of:`)
        client.guilds.cache.forEach(guild => {
            console.log(`  ${guild.id} - ${guild.name}`)
        })
        client.user.setActivity('with yarn', { type: ActivityType.Playing });
    },
};
