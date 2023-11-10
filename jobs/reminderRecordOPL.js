const { data } = require('../commands/post');

const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const noticeChannel = client.channels.cache.get("1074317729978400819") || client.channels.cache.get("1045327770592497694"); // OPL #mod-business or OPie #notifications
        const jobLoadedDate = new Date().toLocaleString();
        var firstShiftTime = Math.floor(new Date().setHours(19, 0, 0) / 1000);
        firstShiftTime += 60 * 60 * 24;
        var showStartTime = Math.floor(new Date().setHours(20, 0, 0) / 1000);
        showStartTime += 60 * 60 * 24;
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Reminder Start Recording`);
        var jobStartRecording = new CronJob(
            '00 45 18,19 * * FRI,SAT', () => {
                // '*/15 * * * * *', () => {
                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    try { noticeChannel.send(`<@348629137080057878> Start recording:\n<t:${firstShiftTime}:t> <t:${firstShiftTime}:R> - First Shift\n<t:${showStartTime}:t> <t:${showStartTime}:R> - On Patrol Live`); }
                    catch (err) { console.error(`[ERROR] Sending message -`, err.message); }
                    // try { client.users.send('348629137080057878', `Start Recording\n<t:${firstShiftTime}:t> <t:${firstShiftTime}:R> - First Shift\n<t:${showStartTime}:t> <t:${showStartTime}:R> - On Patrol Live`); } // PM Bwana
                    // catch (err) { console.error(`[ERROR] Sending message -`, err.message); }
                    const jobExecutedDate = new Date().toLocaleString();
                    console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Reminder Start Recording`);
                }
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
