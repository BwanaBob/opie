const { EmbedBuilder, ActivityType, AttachmentBuilder } = require("discord.js");
const CronJob = require("cron").CronJob;
const { chibiReminderCron } = require("../options.json");

module.exports = {
  execute(client) {
    const modChannel =
      client.channels.cache.get("1250589626717175910") ||
      client.channels.cache.get("392093299890061312"); // OPL #mod-business or OPie #General

    // const noticeChannel = client.channels.cache.get("1043646191247826945") || client.channels.cache.get("1045327770592497694"); // OPL or OPie #notifications
    const jobLoadedDate = new Date().toLocaleString();
    console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Chibi Reminder`);
    var jobChibiReminder = new CronJob(
      chibiReminderCron,
      () => {
        const modReminderEmbed = new EmbedBuilder()
          .setColor(0x0000ff)
          .setTitle("Medicate")
          .setDescription(
            "Take more medication!"
          )

        // noticeChannel.send("On Patrol: Live is starting now!")
        if (client.params.get("chatGPTAnnouncementsEnabled") == "true") {
          modChannel.send({
            content: `<@1250263798070247487>`,
            embeds: [modReminderEmbed],
          });
        }
        const jobExecutedDate = new Date().toLocaleString();
        console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | FS Reminder`);
      },
      null,
      true,
      "America/Chicago"
    );
  },
};
