const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | Start Recording`
        );
        var jobStartRecording = new CronJob(
            '00 45 18 * * FRI,SAT', () => {
                client.channels.cache.get("392120898909634561").send("Start Recording Test")
                const uniDate = new Date().toLocaleString();
                console.log(
                    `[${uniDate}] ⌛ CRON| Start Recording event fired`
                );
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
