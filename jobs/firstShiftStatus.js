const { ActivityType } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        // const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | First Shift Status`);
        var jobFirstShift = new CronJob(
            '00 00 19 * * FRI,SAT', () => {
                //'*/15 * * * * *', () => {
                // talkChannel.send("First Shift is starting now!")
                client.user.setPresence({
                    status: "online",
                    activities: [
                        {
                            type: ActivityType.Watching,
                            name: "First Shift",
                        },
                    ],
                });
                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | First Shift Status`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
