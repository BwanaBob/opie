const ai = require('../modules/openaiCommand.js')
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Show End AI Friday`);
        var jobGoodnightAISat = new CronJob(
            '00 00 23 * * FRI', async () => {
                //'*/10 * * * * *', async () => {
                const aicommand = {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'system',
                        content: 'Respond like a friendly, snarky, discord chatbot kitten named OPie',
                    }, {
                        role: 'user',
                        content: 'Write a closing comment thanking our wonderful discord users for their participation in a terrific watch party for the television show On Patrol: Live. Wish them safe and happy times until the next watch party tomorrow night.'
                    }],
                    max_tokens: 512, // limit token usage (length of response)
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
                console.log(`[${jobExecutedDate}] ⌛ CRON| Job Executed  | Show End AI Friday`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
