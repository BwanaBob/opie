const { ActivityType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | LA Fire & Rescue Start`);
        var jobLAFireStart = new CronJob(
            // '00 00 20 * * WED', () => {
            '00 36 10 * * TUE', () => {
                    //'*/15 * * * * *', () => {
                client.user.setPresence({
                    status: "online",
                    activities: [
                        {
                            type: ActivityType.Watching,
                            name: "LA Fire & Rescue",
                        },
                    ],
                });

                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | LA Fire & Rescue Start`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
