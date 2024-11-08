const { EmbedBuilder, ActivityType, AttachmentBuilder } = require("discord.js");
const CronJob = require("cron").CronJob;
const { firstShiftReminderCron } = require("../options.json");

module.exports = {
  execute(client) {
    const modChannel =
      client.channels.cache.get("1250585288942817381") ||
      client.channels.cache.get("392093299890061312"); // OPL #mod-business or OPie #General

    // const noticeChannel = client.channels.cache.get("1043646191247826945") || client.channels.cache.get("1045327770592497694"); // OPL or OPie #notifications
    const jobLoadedDate = new Date().toLocaleString();
    console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | FS Reminder`);
    var jobFSReminder = new CronJob(
      firstShiftReminderCron,
      () => {
        const modReminderEmbed = new EmbedBuilder()
          .setColor(0x0000ff)
          .setTitle("Record First Shift")
          .setDescription(
            "Start recording First Shift to publish in #Announcements"
          )

        // noticeChannel.send("On Patrol: Live is starting now!")
        if (client.params.get("chatGPTAnnouncementsEnabled") == "true") {
          modChannel.send({
            content: `<@348629137080057878>`,
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
