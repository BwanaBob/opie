const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const postReply = `Posted`;

const kidsEmbed = new EmbedBuilder()
.setColor(0xffce07)
.setTitle("Explicit Content Warning")
.setDescription(
  "Please keep in mind that viewers under 18 years old join us."
)
.setThumbnail(
    "https://i.imgur.com/yunluXs.png"
);

const ferretEmbed = new EmbedBuilder()
.setColor(0xFF69B4)
.setTitle("Ferret Warning")
.setDescription(
  "Please keep in mind that delicate ferrets are watching!"
)
.setThumbnail(
    "https://i.imgur.com/E9dE4eM.png"
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
.setURL('https://www.thatsabingo.com/')
.setThumbnail(
    "https://i.imgur.com/dJP9d8L.png"
);

const redditEmbed = new EmbedBuilder()
.setColor(0xff4500)
.setTitle("Reddit")
.setDescription("Join the discussion on Reddit at r/OnPatrolLive")
.addFields({
  name: "Link",
  value: `[reddit.com](https://www.reddit.com/r/OnPatrolLive/)`,
  inline: true,
})
.setURL('https://www.reddit.com/r/OnPatrolLive/')
.setThumbnail(
    "https://i.imgur.com/sd2bsMa.png"
);

const showtimeEmbed = new EmbedBuilder()
.setColor(0x0000ff)
.setTitle("Showtime")
.setDescription("Welcome and enjoy the show!\nPlease read the rules before posting.")
.setThumbnail("https://i.imgur.com/fJ12AKT.png")
.setImage('https://i.imgur.com/1oZPjOW.png')
.addFields({
  name: "Rules",
  value: `[#rules](https://discord.com/channels/325206992413130753/1000869946215120987)`,
  inline: true})
.addFields({
  name: "Bingo",
  value: `[thatsabingo.com](https://www.thatsabingo.com/)`,
  inline: true})
.addFields({
  name: "Reddit",
  value: `[r/OnPatrolLive](https://www.reddit.com/r/OnPatrolLive/)`,
  inline: true})
//.setFooter({ text: "Showtime: \<t:1680307200:f> - <t:1680307200:R>" });
;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Send an announcement to the current channel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to post')
        .setRequired(true)
        .addChoices(
          { name: 'kids',     value: 'post_kids'     },
          { name: 'bingo',    value: 'post_bingo'    },
          { name: 'showtime', value: 'post_showtime' },
          { name: 'ferret',   value: 'post_ferret'   },
          { name: 'reddit',   value: 'post_reddit'   },
        ))
      // .addChannelOption(option =>
      //   option.setName('channel')
      //     .setDescription('The channel to echo into')
      //     .setRequired(false))
      ,
    async execute(interaction) {
      const postMessage = interaction.options.getString('message') ?? 'post_none';
      let postEmbed = new EmbedBuilder();
      switch(postMessage){
        case "post_kids" : {
          postEmbed = kidsEmbed;
        }
        break;
        case "post_bingo" : {
          postEmbed = bingoEmbed;
        }
        break;
        case "post_reddit" : {
          postEmbed = redditEmbed;
        }
        break;
        case "post_showtime" : {
          postEmbed = showtimeEmbed;
        }
        break;
        case "post_ferret" : {
          postEmbed = ferretEmbed;
        }
        break;
      }
      await interaction.reply({ content: postReply, ephemeral: true });
      interaction.channel.send({ embeds: [postEmbed] });
    },
};

