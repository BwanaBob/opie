const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    var startDate = new Date();
    console.log(`____________________________________________________`);
    console.log(
      `[${startDate.toLocaleString()}] 🤖 START | ${client.user.username} (${client.user.tag})`
    );

    function milestone(members) {
      const membersString = String(members);
      const membersExponent = membersString.length - 1;
      const firstChar = membersString[0];
      const nextMilestone = (Number(firstChar) + 1) * (10 ** membersExponent)
      return nextMilestone;
    }

    client.guilds.cache.forEach((guild) => {
      guild.nextUserCount = milestone(guild.memberCount);
      console.log(`[${startDate.toLocaleString()}] 🖥️  GUILD | ${guild.name} (${guild.memberCount}/${guild.nextUserCount})`);
    });

    client.user.setPresence({
      status: "online",
      activities: [
        {
          type: ActivityType.Watching,
          name: "On Patrol: Live",
        },
      ],
    });
  },
};
