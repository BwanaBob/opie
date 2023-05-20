const ai = require('../modules/ai.js')
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const bingoChannel = client.channels.cache.get("392157063502888962") || client.channels.cache.get("392093299890061312") || client.channels.cache.get("392093299890061312"); // OPL #bingo or Bingo #lobby or 
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | Goodnight AI Bingo Saturday`);
        var jobGoodnightAIBingoSat = new CronJob(
            '00 00 23 * * SAT', async () => {
            //'*/15 * * * * *', async () => {
                const aicommand = {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'system',
                        content: 'Respond like a friendly, snarky, discord chatbot kitten named OPie',
                    }, {
                        role: 'system',
                        content: 'You host a bingo game based on the television show "On Patrol: Live".',
                    }, {
                        role: 'user',
                        content: `Announce the end of tonight's bingo game and the show. Thank our lovely bingo players for playing along. Remind them that the show will not be aired next weekend, but we will return the following weekend for more live Bingo fun.`
                    }],
                    max_tokens: 256, // limit token usage (length of response)
                };

                const airesponse = await ai(aicommand);
                if (!airesponse.undefined && airesponse !== 'ERR') {
                    bingoChannel.send(airesponse)
                } else {
                    console.log(` ⌛ CRON| Job Failed  | Goodnight AI Bingo Saturday`);
                }
                const uniDate = new Date().toLocaleString();
                console.log(`[${uniDate1}] ⌛ CRON| Job Executed  | Goodnight AI Bingo Saturday`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
