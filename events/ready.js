const { Events, ActivityType } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    var startDate = new Date();
    console.log(
      `[${startDate.toLocaleString()}] 🤖 START | Bot Logged In | ${client.user.username} (${client.user.tag})`
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
      console.log(`[${startDate.toLocaleString()}] 🖥️  GUILD | Guild Joined  | ${guild.name} (${guild.memberCount}/${guild.nextUserCount})`);
    });

    //jobs handler
    const jobsPath = path.join(__dirname, "../jobs");
    const jobsFiles = fs
      .readdirSync(jobsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of jobsFiles) {
      const filePath = path.join(jobsPath, file);
      const job = require(filePath);
      job.execute(client);
    }

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
