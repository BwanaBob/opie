const ai = require('../modules/openaiCommand.js')
const CronJob = require('cron').CronJob;
const options = require("../options.json");
const { showEndFriCron } = options;
const { model, messages } = options.jobs.showEndAIFri

module.exports = {
    execute(client) {
        const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Show End AI Friday`);
        var jobGoodnightAISat = new CronJob(
             showEndFriCron, async () => {
                const aicommand = {
                    model,
                    messages,
                    max_completion_tokens: 512, // limit token usage (length of response)
                };

                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    const airesponse = await ai(aicommand);
                    if (!airesponse.undefined && airesponse !== 'ERR') {
                        talkChannel.send(airesponse)
                    } else {
                        console.log(` ⌛ CRON  | Job Failed  | Show End AI Friday`);
                    }
                }

                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Show End AI Friday`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
