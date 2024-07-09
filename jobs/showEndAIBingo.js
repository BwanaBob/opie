const ai = require('../modules/openaiCommand.js')
const CronJob = require('cron').CronJob;
const options = require("../options.json");
const { showEndCron } = options;
const { model, messages } = options.jobs.showEndAIBingo

module.exports = {
    execute(client) {
        const bingoChannel = client.channels.cache.get("392157063502888962") || client.channels.cache.get("392093299890061312") || client.channels.cache.get("392093299890061312"); // OPL #bingo or Bingo #lobby or 
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Show End AI Bingo`);
        var showEndAIBingo = new CronJob(
            showEndCron, async () => {
                const aicommand = {
                    model,
                    messages,
                    max_tokens: 512, // limit token usage (length of response)
                };

                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    const airesponse = await ai(aicommand);
                    if (!airesponse.undefined && airesponse !== 'ERR') {
                        bingoChannel.send(airesponse)
                    } else {
                        console.log(` ⌛ CRON  | Job Failed  | Show End AI Bingo`);
                    }
                }

                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Show End AI Bingo`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
