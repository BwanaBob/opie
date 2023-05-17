const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | Good Night`
        );
        var jobGoodnight = new CronJob(
            '00 00 23 * * FRI,SAT', () => {
                client.channels.cache.get("392120898909634561").send("Goodnight Test")
                const uniDate = new Date().toLocaleString();
                console.log(
                    `[${uniDate}] ⌛ CRON| Goodnight event fired`
                );
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
