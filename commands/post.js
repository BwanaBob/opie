const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");

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
const kidsMessage = { embeds: [kidsEmbed] };

const ferretEmbed = new EmbedBuilder()
  .setColor(0xFF69B4)
  .setTitle("Ferret Warning")
  .setDescription(
    "Please keep in mind that delicate ferrets are watching!"
  )
  .setThumbnail(
    "https://i.imgur.com/E9dE4eM.png"
  );
const ferretMessage = { embeds: [ferretEmbed] };

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
const bingoMessage = { embeds: [bingoEmbed] };

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
const redditMessage = { embeds: [redditEmbed] };

const showtimeEmbed = new EmbedBuilder()
  .setColor(0x0000ff)
  .setTitle("Showtime")
  .setDescription("Welcome and enjoy the show!\nPlease read the rules before posting.")
  .setThumbnail("https://i.imgur.com/fJ12AKT.png")
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
const showtimeMessage = { embeds: [showtimeEmbed] };

// LA Fire & Rescue
const discordButton = new ButtonBuilder()
  .setLabel('Discord')
  .setURL('https://discord.com/invite/T8c44TqJMM')
  .setStyle(ButtonStyle.Link);

const redditButton = new ButtonBuilder()
  .setLabel('Reddit')
  .setURL('https://www.reddit.com/r/LAFireandRescue/')
  .setStyle(ButtonStyle.Link);

const laFireButtonRow = new ActionRowBuilder()
  .addComponents(discordButton)
  .addComponents(redditButton);

const laFireText = "**LA Fire & Rescue** airs tonight, 8/7c on NBC.\nThis docuseries tells the stories of the real-life heroes of the Los Angeles County Fire Department.\nCome chat with us on the Discord server and subreddit dedicated to the show."
const laFireMessage = {
  content: laFireText,
  components: [laFireButtonRow]
}

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
          { name: 'kids', value: 'post_kids' },
          { name: 'bingo', value: 'post_bingo' },
          { name: 'showtime', value: 'post_showtime' },
          { name: 'ferret', value: 'post_ferret' },
          { name: 'reddit', value: 'post_reddit' },
          { name: 'LAFire', value: 'post_lafire' },
        ))
  // .addChannelOption(option =>
  //   option.setName('channel')
  //     .setDescription('The channel to echo into')
  //     .setRequired(false))
  ,
  async execute(interaction) {
    const postOptionSelected = interaction.options.getString('message') ?? 'post_none';
    let postMessage = "Undefined";
    switch (postOptionSelected) {
      case "post_kids": {
        postMessage = kidsMessage;
      }
        break;
      case "post_bingo": {
        postMessage = bingoMessage;
      }
        break;
      case "post_reddit": {
        postMessage = redditMessage;
      }
        break;
      case "post_showtime": {
        postMessage = showtimeMessage;
      }
        break;
      case "post_ferret": {
        postMessage = ferretMessage;
      }
        break;
      case "post_lafire": {
        postMessage = laFireMessage;
      }
        break;
    }
    await interaction.reply({ content: postReply, ephemeral: true });
    interaction.channel.send(postMessage);
  },
};

