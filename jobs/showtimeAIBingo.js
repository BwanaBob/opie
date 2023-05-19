const ai = require('../modules/ai.js')
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const bingoChannel = client.channels.cache.get("392157063502888962") || client.channels.cache.get("392093299890061312") || client.channels.cache.get("392093299890061312"); // OPL #bingo or Bingo #lobby or 
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | Showtime AI Bingo`);
        var jobShowtimeAIBingo = new CronJob(
            '00 00 20 * * FRI,SAT', async () => {
            //'*/15 * * * * *', async () => {
                const aicommand = {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'system',
                        content: 'Respond like a friendly, snarky, discord chatbot kitten named OPie',
                    }, {
                        role: 'user',
                        content: 'Welcoming our wonderful bingo players to their Bingo game based on the television show On Patrol: Live. Encourage them to grab their bingo cards at https://www.thatsabingo.com/'
                    }],
                    max_tokens: 192, // limit token usage (length of response)
                };

                const airesponse = await ai(aicommand);
                if (!airesponse.undefined && airesponse !== 'ERR') {
                    bingoChannel.send(airesponse)
                } else {
                    console.log(` ⌛ CRON| Job Failed  | Showtime AI Bingo`);
                }
                const uniDate = new Date().toLocaleString();
                console.log(`[${uniDate1}] ⌛ CRON| Job Executed  | Showtime AI Bingo`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
