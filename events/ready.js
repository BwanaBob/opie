const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    var startDate = new Date();
    console.log(`____________________________________________________`);
    console.log(
      `[${startDate.toLocaleString()}] 🤖 START | ${client.user.username} (${
        client.user.tag
      })`
    );
    client.guilds.cache.forEach((guild) => {
      console.log(`[${startDate.toLocaleString()}] 🖥️  GUILD | ${guild.name}`);
    });

    client.user.setPresence({
      status: "online",
      activities: [
        {
          type: ActivityType.Watching,
          name: "Puss in Boots",
        },
      ],
    });
  },
};
