const ai = require('../modules/openaiCommand.js')
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | First Shift AI`);
        var jobFirstShiftAI = new CronJob(
            '00 00 19 * * FRI,SAT', async () => {
                //'*/15 * * * * *', async () => {
                const aicommand = {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'system',
                        content: 'Respond like a friendly, snarky, discord chatbot kitten named OPie',
                    }, {
                        role: 'system',
                        content: 'First Shift is a live tv segment that previews and leads into the upcoming show On Patrol: Live. First Shift introduces the law enforcement agencies which will be appearing on On Patrol: Live this evening. First Shift also provides updates on events from previous episodes of On Patrol: Live. First Shift is hosted by Dan Abrams, Sean "Sticks" Larkin, and Curtis Wilson',
                    }, {
                        role: 'user',
                        content: 'Write a pithy Discord comment letting our friends know that First Shift is starting now and welcoming them to enjoy the show as we get ready to watch On Patrol: Live in one hour. Let people know that Seargeant Marcus Booth of the Daytona Beach Police Department will join our hosts in studio tonight.'
                    }],
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
