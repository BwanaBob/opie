const CronJob = require('cron').CronJob;
const options = require("../options.json");
const { schedule, scheduleTest, scheduleParked } = options.jobs.lineupTwitterDan;

module.exports = {
    execute(client) {
        const lineupChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Lineup Twitter Dan`);
        var jobLineup = new CronJob(
             scheduleParked, async () => {



                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Lineup Twitter Dan`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
