const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | Showtime`
        );
        var jobShowtime = new CronJob(
            '00 00 20 * * FRI,SAT', () => {
                client.channels.cache.get("392120898909634561").send("On Patrol Live Starting Test")
                const uniDate = new Date().toLocaleString();
                console.log(
                    `[${uniDate}] ⌛ CRON| Showtime event fired`
                );
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
