const ai = require('../modules/openaiCommand.js')
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Showtime AI`);
        var jobShowtimeAI = new CronJob(
            '00 00 20 * * FRI,SAT', async () => {
                //'*/15 * * * * *', async () => {
                const aicommand = {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'system',
                        content: 'Respond like a friendly, snarky, discord chatbot kitten named OPie',
                    }, {
                        role: 'system',
                        content: 'The television show On Patrol: Live starts now now to follow the activities of law enforcement officers around the country, live. You host this watch party on Discord',
                    }, {
                        role: 'user',
                        content: 'Write an enthusiastic opening comment welcoming our Discord users to their watch party for the television show On Patrol: Live. Shout out to @argentmaid for boosting our Discord server, giving us the final boost needed to achieve level 3. Let people know that Sergeant Marcus Booth of the Daytona Beach Police Department will join our hosts in the studio tonight. Remind everyone that there will be no live shows next weekend, but live shows will return the following weekend on Friday, July 7th.'
                    }],
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
