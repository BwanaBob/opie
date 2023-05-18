const { ActivityType } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | Good Night`);
        var jobGoodnight = new CronJob(
            '00 00 23 * * FRI,SAT', () => {
            //'*/15 * * * * *', () => {
                talkChannel.send("Good night everyone!")
                client.user.setPresence({
                    status: "idle",
                    activities: [
                        {
                            type: ActivityType.Listening,
                            name: "lullabies",
                        },
                    ],
                });
                 const uniDate = new Date().toLocaleString();
                console.log(`[${uniDate}] ⌛ CRON| Job Executed  | Good Night`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
