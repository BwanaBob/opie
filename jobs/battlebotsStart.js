const { ActivityType } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Battlebots Start`);
        var jobBattlebotsStart = new CronJob(
            '00 00 20 * * THU', () => {
                //'*/10 * * * * *', () => {
                //client.channels.cache.get("392120898909634561").send("Scheuled message test")
                const showEndDate = new Date('2023-11-10');
                const nowDate = new Date();
                const jobExecutedDate = new Date().toLocaleString();
                if (nowDate > showEndDate) {
                    console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Battlebots Start (Show Ended)`);
                } else {
                    client.user.setPresence({
                        status: "online",
                        activities: [
                            {
                                type: ActivityType.Watching,
                                name: "Battlebots! 🤖👊🕗",
                            },
                        ],
                    });
                    console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Battlebots Start`);
                }
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
