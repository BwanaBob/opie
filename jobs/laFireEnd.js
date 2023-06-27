const { ActivityType } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | LA Fire & Rescue End`);
        var jobLAFireEnd = new CronJob(
            '00 00 20,22 * * WED', () => {
                //'*/15 * * * * *', () => {
                client.user.setPresence({
                    status: "online",
                    activities: [
                        {
                            type: ActivityType.Watching,
                            name: "Reelz",
                        },
                    ],
                });
                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | LA Fire & Rescue End`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
