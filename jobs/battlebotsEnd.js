const { ActivityType } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | Battlebots End`);
        var jobBattlebotsEnd = new CronJob(
            '00 00 22 * * THU', () => {
            //'*/10 * * * * *', () => {
                //client.channels.cache.get("392120898909634561").send("Scheuled message test")
                client.user.setPresence({
                    status: "online",
                    activities: [
                        {
                            type: ActivityType.Watching,
                            name: "Reelz",
                        },
                    ],
                });
                const uniDate = new Date().toLocaleString();
                console.log(`[${uniDate1}] ⌛ CRON  | Job Executed  | Battlebots End`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
