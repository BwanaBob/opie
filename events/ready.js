const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    var startDate = new Date();
    console.log(`___________________________________________________________`);
    console.log(
      `[${startDate.toLocaleString()}] ${client.user.username} (${
        client.user.tag
      }) Logged in`
    );
    client.guilds.cache.forEach((guild) => {
      console.log(`                          ${guild.name}`);
    });
    client.user.setActivity("a lizard outside", { type: ActivityType.Watching });
  },
};
