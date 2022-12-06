const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
//		console.log(`Ready! Logged in as ${client.user.tag}`);
        console.log(`Logged in as: ${client.user.username} (${client.user.tag})`)
        console.log(`Member of:`)
        client.guilds.cache.forEach(guild => {
            console.log(`  ${guild.id} - ${guild.name}`)
        })
        client.user.setActivity('with yarn', { type: ActivityType.Playing });
    },
};
