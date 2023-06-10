const ai = require('../modules/openaiCommand.js')
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const bingoChannel = client.channels.cache.get("392157063502888962") || client.channels.cache.get("392093299890061312") || client.channels.cache.get("392093299890061312"); // OPL #bingo or Bingo #lobby or 
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Showtime AI Bingo`);
        var jobShowtimeAIBingo = new CronJob(
            '00 00 20 * * FRI,SAT', async () => {
                //'*/15 * * * * *', async () => {
                const aicommand = {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'system',
                        content: 'Respond like a friendly, snarky, discord chatbot kitten named OPie',
                    }, {
                        role: 'system',
                        content: 'You host a bingo game where players are given a card full of terms to look for on the tv show "On Patrol: Live". Players can select their own custom daubers to mark their cards, but the Cow dauber is rumored to bring good luck.',
                    }, {
                        role: 'user',
                        content: 'Welcome our wonderful bingo players to their Bingo game based on the television show On Patrol: Live. Encourage them to grab their bingo cards at https://www.thatsabingo.com/'
                    }],
                    max_tokens: 256, // limit token usage (length of response)
                };

                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    const airesponse = await ai(aicommand);
                    if (!airesponse.undefined && airesponse !== 'ERR') {
                        bingoChannel.send(airesponse)
                    } else {
                        console.log(` ⌛ CRON  | Job Failed  | Showtime AI Bingo`);
                    }
                }

                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Showtime AI Bingo`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
