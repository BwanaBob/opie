const CronJob = require('cron').CronJob;
const options = require("../options.json");

module.exports = {
    execute(client) {
        const modChannel = client.channels.cache.get("1074317729978400819") || client.channels.cache.get("392093299890061312"); // OPL #mod-business or OPie #General
        const jobLoadedDate = new Date().toLocaleString();
        var noticeRole = '391837678967980035'; // OPie Test Role
        var friShowTime = Math.floor(new Date().setHours(4, 0, 19, 0, 0) / 1000);
        // friShowTime.setDate(friShowTime.getDate() + 1);
        var satShowTime = Math.floor(new Date().setHours(20, 0, 0) / 1000);
        // satShowTime.setDate(satShowTime.getDate() + 1);
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Roll Call`);
        var jobRollCall = new CronJob(
            '00 00 15 * * THU', async () => {
                // '*/15 * * * * *', async () => {
                var reacts = ["🤖", "💬", "🎱", "⛔", "⏲️", "🤷"];
                // var friMessageContent = `## Friday Roll Call\nWho will be available to mod <t:${friShowTime}:F>?\n🤖 Reddit  💬 Discord  🎱 Bingo  ⛔ Can't make it  ⏲️ Part time  🤷 Not sure`
                // var satMessageContent = `## Saturday Roll Call\nWho will be available to mod <t:${satShowTime}:F>?\n🤖 Reddit  💬 Discord  🎱 Bingo  ⛔ Can't make it  ⏲️ Part time  🤷 Not sure`
                var friMessageContent = `## Friday Roll Call\nWho will be available to mod on Friday?\n🤖 Reddit  💬 Discord  🎱 Bingo  ⛔ Can't make it  ⏲️ Part time  🤷 Not sure`
                var satMessageContent = `## Saturday Roll Call\nWho will be available to mod on Saturday?\n🤖 Reddit  💬 Discord  🎱 Bingo  ⛔ Can't make it  ⏲️ Part time  🤷 Not sure`
                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    if (client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
                        noticeRole = '343568731793915904';  // OPL Moderator
                        reacts = ["<:reddit_snoo:1129542362641739856>", "<:discord_clyde:1157337181711515710>", "<:bingo:1066838689814163466>", "⛔", "⏲️", "🤷"];
                        // friMessageContent = `## Friday Roll Call\nWho will be available to mod <t:${friShowTime}:F>?\n<:reddit_snoo:1129542362641739856> Reddit  <:discord_clyde:1157337181711515710> Discord  <:bingo:1066838689814163466> Bingo  ⛔ Can't make it  ⏲️ Part time  🤷 Not sure`
                        // satMessageContent = `## Saturday Roll Call\nWho will be available to mod <t:${satShowTime}:F>?\n<:reddit_snoo:1129542362641739856> Reddit  <:discord_clyde:1157337181711515710> Discord  <:bingo:1066838689814163466> Bingo  ⛔ Can't make it  ⏲️ Part time  🤷 Not sure`
                        friMessageContent = `## Friday Roll Call\nWho will be available to mod on Friday?\n<:reddit_snoo:1129542362641739856> Reddit  <:discord_clyde:1157337181711515710> Discord  <:bingo:1066838689814163466> Bingo  ⛔ Can't make it  ⏲️ Part time  🤷 Not sure`
                        satMessageContent = `## Saturday Roll Call\nWho will be available to mod on Saturday?\n<:reddit_snoo:1129542362641739856> Reddit  <:discord_clyde:1157337181711515710> Discord  <:bingo:1066838689814163466> Bingo  ⛔ Can't make it  ⏲️ Part time  🤷 Not sure`
                    }
                    await modChannel.send(`<@&${noticeRole}>`)
                        .catch(err => { console.error(`[ERROR] Sending message: `, err.message); });
                    const friMessage = await modChannel.send(friMessageContent)
                        .catch(err => { console.error(`[ERROR] Sending message: `, err.message); });
                    friMessage.react(reacts[0])
                        .then(() => friMessage.react(reacts[1]))
                        .then(() => friMessage.react(reacts[2]))
                        .then(() => friMessage.react(reacts[3]))
                        .then(() => friMessage.react(reacts[4]))
                        .then(() => friMessage.react(reacts[5]))
                        .catch(err => { console.error(`[ERROR] Reacting to message ${friMessage.id} -`, err.message); });

                    const satMessage = await modChannel.send(satMessageContent)
                        .catch(err => { console.error(`[ERROR] Sending message: `, err.message); });
                    satMessage.react(reacts[0])
                        .then(() => satMessage.react(reacts[1]))
                        .then(() => satMessage.react(reacts[2]))
                        .then(() => satMessage.react(reacts[3]))
                        .then(() => satMessage.react(reacts[4]))
                        .then(() => satMessage.react(reacts[5]))
                        .catch(err => { console.error(`[ERROR] Reacting to message ${satMessage.id} -`, err.message); });

                }
                const jobExecutedDate = new Date().toLocaleString();
                console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Roll Call`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
