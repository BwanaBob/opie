const CronJob = require('cron').CronJob;
const { todoFriCron } = require("../options.json");

module.exports = {
    execute(client) {
        const noticeChannel = client.channels.cache.get("1250585288942817381") || client.channels.cache.get("1045327770592497694"); // OPL #mod-business or OPie #notifications
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Reminder Todo Fri`);
        var todoListFridayJob = new CronJob(
            todoFriCron, async () => {
            // '*/25 * * * * *', async () => {
                let noticeRole = '391837678967980035'; // OPie Test Role
                let reacts = ["🧵", "🤖", "📆", "📋", "💬", "⏺️", "🚨", "🧹", "🏅"];
                const scheduleTime = Math.floor(new Date().setHours(17, 58, 0) / 1000);
                if (client.params.get("chatGPTAnnouncementsEnabled") == 'true') {
                    if (client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
                        noticeRole = '325210261722234881';  // OPL Admin
                        reacts = ["🧵", "🤖", "📆", "📋", "💬", "⏺️", "🚨", "🧹", "🏅"];
                    }
                    let noticeContent = `<@&${noticeRole}>\n## Friday Checklist\n### Pre-show\n🧵 [Thread](<https://www.reddit.com/r/OnPatrolLive/about/wiki/moderation/live-thread/>) scheduled at <t:${scheduleTime}:t> <t:${scheduleTime}:R>\n🤖 [OPie prompts](<https://github.com/BwanaBob/opie/commits/main/>)\n📆 [Sidebar Schedule](<https://www.reelz.com/schedule/>)\n📋 [Lineup](<https://twitter.com/danabrams>)\n💬 Opening comment\n⏺️ [First Shift Recording](<https://www.reelznow.com/live>)\n🚨 Set Community Status\n### After\n🧹 Closing, !tidy, and remove community status\n🏅 Comment of the Night Awards`;
                    const noticeMessage = await noticeChannel.send({ content: noticeContent })
                        .catch(err => { console.error(`[ERROR] Sending message: `, err.message); });
                    noticeMessage.react(reacts[0])
                        .then(() => noticeMessage.react(reacts[1]))
                        .then(() => noticeMessage.react(reacts[2]))
                        .then(() => noticeMessage.react(reacts[3]))
                        .then(() => noticeMessage.react(reacts[4]))
                        .then(() => noticeMessage.react(reacts[5]))
                        .then(() => noticeMessage.react(reacts[6]))
                        .then(() => noticeMessage.react(reacts[7]))
                        .then(() => noticeMessage.react(reacts[8]))
                        .catch(err => { console.error(`[ERROR] Reacting to message ${noticeMessage.id} -`, err.message); });
                    const jobExecutedDate = new Date().toLocaleString();
                    console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Reminder Todo Fri`);
                }
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
