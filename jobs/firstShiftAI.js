const ai = require('../modules/openaiCommand.js')
const CronJob = require('cron').CronJob;
const options = require("../options.json");
const { firstShiftStartCron } = options;
const { model, messages } = options.jobs.firstShiftAI

module.exports = {
    execute(client) {
        const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | First Shift AI`);
        var jobFirstShiftAI = new CronJob(
             firstShiftStartCron, async () => {
                const aicommand = {
                    model,
                    messages,
                    max_tokens: 512, // limit token usage (length of response)
                };

                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    const airesponse = await ai(aicommand);
                    if (!airesponse.undefined && airesponse !== 'ERR') {
                        talkChannel.send(airesponse)
                    } else {
                        console.log(` ⌛ CRON  | Job Failed  | First Shift AI`);
                    }
                }

                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | First Shift AI`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
