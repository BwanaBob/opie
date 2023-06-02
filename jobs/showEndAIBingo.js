const ai = require('../modules/openaiCommand.js')
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const bingoChannel = client.channels.cache.get("392157063502888962") || client.channels.cache.get("392093299890061312") || client.channels.cache.get("392093299890061312"); // OPL #bingo or Bingo #lobby or 
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Show End AI Bingo`);
        var jobGoodnightAIBingo = new CronJob(
            '00 00 23 * * FRI,SAT', async () => {
                //'*/15 * * * * *', async () => {
                const aicommand = {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'system',
                        content: 'Respond like a friendly, snarky, discord chatbot kitten named OPie',
                    }, {
                        role: 'system',
                        content: 'You host a bingo game based on the television show "On Patrol: Live". There are no prizes in your bingo game, we play for fun and bragging rights',
                    }, {
                        role: 'user',
                        content: `Announce the end of tonight's bingo game and the show. Thank our lovely bingo players for playing along. Remind them to come back next episode for more live Bingo fun.`
                    }],
                    max_tokens: 256, // limit token usage (length of response)
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
