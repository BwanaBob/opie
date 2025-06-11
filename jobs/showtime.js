const { EmbedBuilder, ActivityType, AttachmentBuilder } = require("discord.js");
const CronJob = require("cron").CronJob;
const { showStartCron } = require("../options.json");

module.exports = {
  execute(client) {
    const bingoChannel =
      client.channels.cache.get("392157063502888962") ||
      client.channels.cache.get("392093299890061312") ||
      client.channels.cache.get("392093299890061312"); // OPL #bingo or Bingo #lobby or
    const talkChannel =
      client.channels.cache.get("325207222814507018") ||
      client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
    const modChannel =
      client.channels.cache.get("1250585288942817381") ||
      client.channels.cache.get("392093299890061312"); // OPL #mod-business or OPie #General

    // const noticeChannel = client.channels.cache.get("1382210305463160934") || client.channels.cache.get("1045327770592497694"); // OPL or OPie #notifications
    const jobLoadedDate = new Date().toLocaleString();
    console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Showtime`);
    var jobShowtime = new CronJob(
      showStartCron,
      () => {
        // '*/15 * * * * *', () => {
        const showtimeImage = new AttachmentBuilder(
          "./resources/thumb-opl.png",
          { name: "thumb-opl.png" }
        );
        const showtimeBanner = new AttachmentBuilder(
          "./resources/banner-no-text.png",
          { name: "banner-no-text.png" }
        );
        const showtimeEmbed = new EmbedBuilder()
          .setColor(0x0000ff)
          .setTitle("Showtime")
          .setDescription(
            "Welcome and enjoy the show!\nPlease read the rules before posting."
          )
          .setThumbnail("attachment://thumb-opl.png")
          .setImage("attachment://banner-no-text.png")
          .addFields({
            name: "Rules",
            value: `[#rules](https://discord.com/channels/325206992413130753/1000869946215120987)`,
            inline: true,
          })
          .addFields({
            name: "Bingo",
            value: `[thatsabingo.com](https://www.thatsabingo.com/)`,
            inline: true,
          })
          .addFields({
            name: "Reddit",
            value: `[r/OnPatrolLive](https://www.reddit.com/r/OnPatrolLive/)`,
            inline: true,
          });
        //.setFooter({ text: "Showtime: \<t:1680307200:f> - <t:1680307200:R>" });
        const bingoImage = new AttachmentBuilder(
          "./resources/thumb-bingo.png",
          { name: "thumb-bingo.png" }
        );
        const bingoEmbed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle("Bingo")
          .setDescription("Get your bingo cards and play with us live!")
          .addFields({
            name: "Website",
            value: `[thatsabingo.com](https://www.thatsabingo.com/)`,
            inline: true,
          })
          .setURL("https://www.thatsabingo.com/")
          .setThumbnail("attachment://thumb-bingo.png");

        const modReminderEmbed = new EmbedBuilder()
          .setColor(0x0000ff)
          .setTitle("Set Community Status")
          .setDescription(
            "Set the community status and include a link to the live thread."
          )
          .setThumbnail("attachment://thumb-opl.png");

        // noticeChannel.send("On Patrol: Live is starting now!")
        if (client.params.get("chatGPTAnnouncementsEnabled") == "true") {
          talkChannel.send({
            embeds: [showtimeEmbed],
            files: [showtimeImage, showtimeBanner],
          });
          bingoChannel.send({ embeds: [bingoEmbed], files: [bingoImage] });
          // modChannel.send({
          //   content: `<@&325210261722234881>`,
          //   embeds: [modReminderEmbed],
          // });
        }
        client.user.setPresence({
          status: "online",
          activities: [
            {
              type: ActivityType.Playing,
              name: "Bingo",
            },
          ],
        });
        const jobExecutedDate = new Date().toLocaleString();
        console.log(`[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Showtime`);
      },
      null,
      true,
      "America/Chicago"
    );
  },
};
