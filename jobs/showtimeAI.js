const ai = require('../modules/openaiCommand.js')
const CronJob = require('cron').CronJob;
const options = require("../options.json");
const { showStartCron } = options;
const { model, messages } = options.jobs.showtimeAI

module.exports = {
    execute(client) {
        const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Showtime AI`);
        var jobShowtimeAI = new CronJob(
            showStartCron, async () => {
                const aicommand = {
                    model,
                    messages,
                    max_tokens: 1024, // limit token usage (length of response)
                };

                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    const airesponse = await ai(aicommand);
                    if (!airesponse.undefined && airesponse !== 'ERR') {
                        talkChannel.send(airesponse)
                    } else {
                        console.log(` ⌛ CRON  | Job Failed  | Showtime AI`);
                    }
                }

                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Showtime AI`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
