const { EmbedBuilder } = require("discord.js");
const CronJob = require('cron').CronJob;

module.exports = {
    execute(client) {
        const bingoChannel = client.channels.cache.get("392157063502888962") || client.channels.cache.get("392093299890061312") || client.channels.cache.get("392093299890061312"); // OPL #bingo or Bingo #lobby or 
        const talkChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #epdis or OPie #General
        const noticeChannel = client.channels.cache.get("1043646191247826945") || client.channels.cache.get("1045327770592497694") ; // OPL or OPie #notifications
        const guildIcon =  client.guilds.cache.get('391821567241224192').iconURL() || "https://i.imgur.com/fJ12AKT.png";
        const uniDate1 = new Date().toLocaleString();
        console.log(`[${uniDate1}] ⌛ CRON  | Job Loaded    | Showtime`);
        var jobShowtime = new CronJob(
            //'00 00 20 * * FRI,SAT', () => {
            '00 05 00 * * *', () => {
                const showtimeEmbed = new EmbedBuilder()
                    .setColor(0x0000ff)
                    .setTitle("Showtime")
                    .setDescription("Welcome and enjoy the show!\nPlease read the rules before posting.")
                    //.setThumbnail("https://i.imgur.com/fJ12AKT.png")
                    .setThumbnail(guildIcon)
                    .setImage('https://i.imgur.com/1oZPjOW.png')
                    .addFields({
                        name: "Rules",
                        value: `[#rules](https://discord.com/channels/325206992413130753/1000869946215120987)`,
                        inline: true
                    })
                    .addFields({
                        name: "Bingo",
                        value: `[thatsabingo.com](https://www.thatsabingo.com/)`,
                        inline: true
                    })
                    .addFields({
                        name: "Reddit",
                        value: `[r/OnPatrolLive](https://www.reddit.com/r/OnPatrolLive/)`,
                        inline: true
                    })
                    //.setFooter({ text: "Showtime: \<t:1680307200:f> - <t:1680307200:R>" });
                    ;

                const bingoEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle("Bingo")
                    .setDescription("Get your bingo cards and play with us live!")
                    .addFields({
                        name: "Website",
                        value: `[thatsabingo.com](https://www.thatsabingo.com/)`,
                        inline: true,
                    })
                    .setURL('https://www.thatsabingo.com/')
                    .setThumbnail(
                        "https://i.imgur.com/dJP9d8L.png"
                    );

                noticeChannel.send("On Patrol: Live is starting now!")
                talkChannel.send({ embeds: [showtimeEmbed] });
                bingoChannel.send({ embeds: [bingoEmbed] });

                const uniDate = new Date().toLocaleString();
                console.log(`[${uniDate}] ⌛ CRON| Job Executed  | Showtime`);
            },
            null,
            true,
            'America/Chicago'
        );
    },
};
