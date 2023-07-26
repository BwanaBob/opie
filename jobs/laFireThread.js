const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const noticeChannel = client.channels.cache.get("1119423219431116940") || client.channels.cache.get("1045327770592497694"); // LAFR or OPie #notifications

        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | LAFR Thread Reminder`);
        var jobStartRecording = new CronJob(
            '00 16 23 * * TUE', () => {
                // '*/15 * * * * *', () => {
                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    noticeChannel.send("<@&1119424005175246992> Update the thread for tomorrow's show!")
                    // try { client.users.send('348629137080057878', "Start Recording"); } // PM Bwana
                    // catch (err) { console.error(`[ERROR] Sending message -`, err.message); }
                    const jobExecutedDate = new Date().toLocaleString();
                    console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | LAFR Thread Reminder`);
                }
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
