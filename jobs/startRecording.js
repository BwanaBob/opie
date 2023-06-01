const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const noticeChannel = client.channels.cache.get("1043646191247826945") || client.channels.cache.get("1045327770592497694"); // OPL or OPie #notifications

        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | Start Recording`);
        var jobStartRecording = new CronJob(
            '00 45 18 * * FRI,SAT', () => {
                //'*/15 * * * * *', () => {
                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {

                    noticeChannel.send("<@348629137080057878> Start recording First Shift!")
                    const uniDate = new Date().toLocaleString();
                    console.log(`[${uniDate}] ⌛ CRON  | Job Executed  | Start Recording`);
                }
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
