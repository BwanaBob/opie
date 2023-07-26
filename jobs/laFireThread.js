const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const noticeChannel = client.channels.cache.get("1119423219431116940") || client.channels.cache.get("1045327770592497694"); // LAFR or OPie #notifications
        const noticeRole = '1119424005175246992'; // LAFR Moderator
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | LAFR Thread Reminder`);
        var jobStartRecording = new CronJob(
            '00 00 18 * * TUE', () => {
                // '*/15 * * * * *', () => {
                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    const showEndDate = new Date('2023-08-10');
                    const nowDate = new Date();
                    const jobExecutedDate = new Date().toLocaleString();
                    if (nowDate > showEndDate) {
                        console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | LAFR Thread Reminder (Show Ended)`);
                    } else {
                        try { noticeChannel.send(`<@&${noticeRole}>,\nUpdate the scheduled Reddit [live thread](https://www.reddit.com/r/LAFireandRescue/about/scheduledposts) for tomorrow's __**LA Fire & Rescue**__ episode!\nGet your information [here](https://tvlistings.zap2it.com/overview.html?tabName=guide&programSeriesId=SH04716491&aid=gapzap)`); }
                        catch (err) { console.error(`[ERROR] Sending message -`, err.message); }
                        console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | LAFR Thread Reminder`);
                    }
                }
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
