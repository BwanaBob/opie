const CronJob = require('cron').CronJob;
const { Poll } = require('discord.js');
const { rollCallCron } = require("../options.json");

module.exports = {
    execute(client) {
        const modChannel = client.channels.cache.get("1250585288942817381") || client.channels.cache.get("392093299890061312"); // OPL #mod-business or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        var noticeRole = '391837678967980035'; // OPie Test Role
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Roll Call Poll`);
        var jobRollCallPoll = new CronJob(
            rollCallCron, async () => {
            // '*/15 * * * * *', async () => {
                var friPollContent = {
                    question: { text: "Will you be available to moderate on Friday?" },
                    answers: [
                        { text: "Reddit", emoji: '🤖'},
                        { text: "Discord", emoji: '💬'},
                        { text: "Bingo", emoji: '🎱'},
                        { text: "Can't Make It", emoji: '⛔'},
                        { text: "Part Time", emoji: '⏲️'},
                        { text: "Not Sure", emoji: '🤷'},
                    ],
                    allowMultiselect: true,
                    duration: 32,
                };
                var satPollContent = {
                    question: { text: "Will you be available to moderate on Saturday?" },
                    answers: [
                        { text: "Reddit", emoji: '🤖'},
                        { text: "Discord", emoji: '💬'},
                        { text: "Bingo", emoji: '🎱'},
                        { text: "Can't Make It", emoji: '⛔'},
                        { text: "Part Time", emoji: '⏲️'},
                        { text: "Not Sure", emoji: '🤷'},
                    ],
                    allowMultiselect: true,
                    duration: 56,
                };

                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    if (client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
                        noticeRole = '343568731793915904';  // OPL Moderator
                        friPollContent = {
                            question: { text: "Will you be available to moderate on Friday?" },
                            answers: [
                                { text: "Reddit", emoji: '<:reddit_snoo:1129542362641739856>'},
                                { text: "Discord", emoji: '<:discord_clyde:1157337181711515710>'},
                                { text: "Bingo", emoji: '<:bingo:1066838689814163466>'},
                                { text: "Can't Make It", emoji: '⛔'},
                                { text: "Part Time", emoji: '⏲️'},
                                { text: "Who the fuck knows", emoji: '🤷'},
                            ],
                            allowMultiselect: true,
                            duration:32,
                        };
                        satPollContent = {
                            question: { text: "Will you be available to moderate on Saturday?" },
                            answers: [
                                { text: "Reddit", emoji: '<:reddit_snoo:1129542362641739856>'},
                                { text: "Discord", emoji: '<:discord_clyde:1157337181711515710>'},
                                { text: "Bingo", emoji: '<:bingo:1066838689814163466>'},
                                { text: "Can't Make It", emoji: '⛔'},
                                { text: "Part Time", emoji: '⏲️'},
                                { text: "Who the fuck knows", emoji: '🤷'},
                            ],
                            allowMultiselect: true,
                            duration: 56,
                        };
                    }
                    await modChannel.send(`<@&${noticeRole}>`)
                        .catch(err => { console.error(`[ERROR] Sending message: `, err.message); });
                    // await modChannel.send(`Ignore this, just testing ATM`)
                    //     .catch(err => { console.error(`[ERROR] Sending message: `, err.message); });
                    await modChannel.send({poll: friPollContent})
                        .catch(err => { console.error(`[ERROR] Sending message: `, err.message); });
                    await modChannel.send({poll: satPollContent})
                        .catch(err => { console.error(`[ERROR] Sending message: `, err.message); });
                }
                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Roll Call Poll`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
