const { ActivityType } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | First Shift`);
        var jobFirstShift = new CronJob(
            '00 00 19 * * FRI,SAT', () => {
                //'*/15 * * * * *', () => {
                talkChannel.send("First Shift is starting now!")
                client.user.setPresence({
                    status: "online",
                    activities: [
                        {
                            type: ActivityType.Watching,
                            name: "First Shift",
                        },
                    ],
                });
                const uniDate = new Date().toLocaleString();
                console.log(`[${uniDate}] ⌛ CRON| Job Executed  | First Shift`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
