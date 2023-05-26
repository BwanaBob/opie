const ai = require('../modules/openaiCommand.js')
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | Showtime AI`);
        var jobShowtimeAI = new CronJob(
            '00 00 20 * * FRI,SAT', async () => {
                //'*/15 * * * * *', async () => {
                const aicommand = {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'system',
                        content: 'Respond like a friendly, snarky, discord chatbot kitten named OPie',
                    }, {
                        role: 'user',
                        content: 'Write an opening comment welcoming our wonderful discord users to their watch party for the television show On Patrol: Live.'
                    }],
                    max_tokens: 256, // limit token usage (length of response)
                };

                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    const airesponse = await ai(aicommand);
                    if (!airesponse.undefined && airesponse !== 'ERR') {
                        talkChannel.send(airesponse)
                    } else {
                        console.log(` ⌛ CRON  | Job Failed  | Showtime AI`);
                    }
                }

                const uniDate = new Date().toLocaleString();
                console.log(`[${uniDate1}] ⌛ CRON  | Job Executed  | Showtime AI`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
