const { ActivityType } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Battlebots End`);
        var jobBattlebotsEnd = new CronJob(
            '00 00 22 * * THU', () => {
                //'*/10 * * * * *', () => {
                //client.channels.cache.get("392120898909634561").send("Scheuled message test")
                const showEndDate = new Date('2023-11-10');
                const nowDate = new Date();
                const jobExecutedDate = new Date().toLocaleString();
                if (nowDate > showEndDate) {
                    console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Battlebots End (Show Ended)`);
                } else {
                    client.user.setPresence({
                        status: "online",
                        activities: [
                            {
                                type: ActivityType.Watching,
                                name: "Reelz",
                            },
                        ],
                    });
                    console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Battlebots End`);
                }
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
