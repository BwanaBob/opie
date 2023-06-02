const { ActivityType } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Replay Status`);
        var jobFirstShift = new CronJob(
            '00 00 16 * * FRI,SAT', () => {
                //'*/15 * * * * *', () => {
                client.user.setPresence({
                    status: "online",
                    activities: [
                        {
                            type: ActivityType.Watching,
                            name: "the replay",
                        },
                    ],
                });
                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Replay Status`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
