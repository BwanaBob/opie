const { ActivityType } = require("discord.js");
const { name } = require("../events/messageCreate");
const options = require("../options.json");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const jobLoadedDate = new Date().toLocaleString();
        console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Status Rotation`);
        var statuses = [
            { status: "online", activities: [{ type: ActivityType.Watching, name: "birds outside 🐦" }] },
            { status: "online", activities: [{ type: ActivityType.Watching, name: "you type... ⌨️" }] },
            { status: "online", activities: [{ type: ActivityType.Watching, name: "the cursor move" }] },
            { status: "online", activities: [{ type: ActivityType.Watching, name: "for commands" }] },
            { status: "online", activities: [{ type: ActivityType.Watching, name: "over chat 👀" }] },
            { status: "online", activities: [{ type: ActivityType.Custom, state: "🐾 Cat-aloging your chats", name: "🐾 Cat-aloging your chats" }] },
            { status: "online", activities: [{ type: ActivityType.Custom, state: "😻 Your purr-sonal assistant", name: "😻 Your purr-sonal assistant" }] },
            { status: "online", activities: [{ type: ActivityType.Custom, state: "🐾 Pawsing to think...", name: "🐾 Pawsing to think..." }] },
            { status: "online", activities: [{ type: ActivityType.Custom, state: "🐾 Chasing laser pointers", name: "🐾 Chasing laser pointers" }] },
            { status: "online", activities: [{ type: ActivityType.Custom, state: "🐱 Purr-petually ready", name: "🐱 Purr-petually ready" }] },
            { status: "online", activities: [{ type: ActivityType.Listening, name: "to the hum of the server" }] },
        ]
        var jobStatusRotation = new CronJob(
            '58 */6 * * * *', () => {
                if (client.params.get("statusRotationEnabled") == 'true') {
                    var newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    client.user.setPresence(newStatus);
                    const jobExecutedDate = new Date().toLocaleString();
                    const newStatusType = newStatus.activities[0].type
                    const newStatusName = newStatus.activities[0].state || newStatus.activities[0].name
                    console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Status Rotation | ${newStatusType} | ${newStatusName}`);
                }
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
