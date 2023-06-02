const { ActivityType } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        // const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Show End Status`);
        var jobGoodnight = new CronJob(
            '00 00 23 * * FRI,SAT', () => {
            //'*/15 * * * * *', () => {
                // talkChannel.send("Good night everyone!")
                client.user.setPresence({
                    status: "idle",
                    activities: [
                        {
                            type: ActivityType.Listening,
                            name: "lullabies",
                        },
                    ],
                });
                 const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Show End Status`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
