const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const noticeChannel = client.channels.cache.get("1043646191247826945") || client.channels.cache.get("1045327770592497694"); // OPL or OPie #notifications

        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Start Recording`);
        var jobStartRecording = new CronJob(
            '00 45 18,19 * * FRI,SAT', () => {
                //'*/15 * * * * *', () => {
                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    // noticeChannel.send("<@348629137080057878> Start recording!")
                    try { client.users.send('348629137080057878', "Start Recording"); } // PM Bwana
                    catch (err) { console.error(`[ERROR] Sending message -`, err.message); }
                    const jobExecutedDate = new Date().toLocaleString();
                    console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Start Recording`);
                }
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
