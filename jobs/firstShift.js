const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | First Shift`
        );
        var jobFirstShift = new CronJob(
            '00 00 19 * * FRI,SAT', () => {
                client.channels.cache.get("392120898909634561").send("First Shift Starting Test")
                const uniDate = new Date().toLocaleString();
                console.log(
                    `[${uniDate}] ⌛ CRON| First Shift event fired`
                );
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
