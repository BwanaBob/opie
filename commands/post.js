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

const rulesEmbed = new EmbedBuilder()
  .setColor(0x2B2D31)
  // .setTitle("Rules")
  .setDescription("Welcome to the On Patrol: Live server! These are the rules for this server. We want everyone to have fun, so please make sure to read them over.\n\
## 👮  **Be Legal**  👮\n\
\n\
### 1️⃣  __No piracy.__\n\
Requesting or sharing details about illegal sources of show content is prohibited and may result in a ban. \n\
### 2️⃣  __Do not interfere with EMS/FIRE/LEO personnel in an attempt to get on the show.__\n\
This is both dangerous and illegal.\n\
### 3️⃣  __Do not post personal information of civilians featured on the show.__\n\
This includes addresses, phone numbers, arrest reports, Google street views, LinkedIn profiles, and personal accounts for Facebook, TikTok, Twitter, Instagram, etc. Doxxing will not be tolerated and will result in a ban.\n\
### 4️⃣  __No advertising other websites, products, or Discord servers.__\n\
This server is not a podium for promotion of unaffiliated servers, webpages, social media, or products in order to gain subscribers or make money. This includes DMing unsolicited invites, referral links, or setting your custom status to an invite. Blatant advertisements will be removed. Users DMing unsolicited invites or repeatedly posting advertisements will be banned.\n\
## 🕊️   **Be Respectful**  🕊️\n\
\n\
### 5️⃣  __No spamming or flooding the chat with messages, name changes, or gifs.__\n\
Overuse of gifs is annoying and makes it difficult to read the chat, especially during showtime. This, and frequent name-changing, will be considered spam and will result in administrative action.\n\
### 6️⃣  __No harassment or bullying; no bashing or heated arguments with others in the chat.__\n\
With a little thought, we can discuss civilly or just agree to disagree. Repeated complaints regarding a user from multiple members will lead to administrative action. Any personal attacks will result in a ban.\n\
### 7️⃣  __No sexual, explicit, body shaming, or controversial content.__\n\
This includes commenting on the \"hotness factor\" (or lack thereof) of people on the show. Usernames, profile pictures, banners, bios, and status should not display any harmful, offensive, or explicit material. Bragging about drug or alcohol use will not be tolerated. Repeated infractions or arguments over removal of such content will result in a ban.\n\
### 8️⃣  __No racist, degrading, or other discriminatory content.__\n\
Any such content will be removed. Repeated infractions or arguments over removal of such content will result in a ban.\n\
### 9️⃣  __No discussion of politics.__\n\
This is a server about a TV show. General discussions of laws referred to on the show are fine, but be careful not to allow such discussions to devolve into politics.\n\
### 🔟  __Inviting unofficial bots is NOT allowed.__\n\
Any unapproved bots found will be instantly banned.\n\
\n\
📌 Other common sense rules and [Discord's Rules](https://discord.com/guidelines) also apply to this server at the discretion of the moderators.\n\
\n\
📌 Any questions, concerns or suggestions can be forwarded to a <@&343568731793915904>, whose usernames are in purple.\n\
\n\
📌 Get involved with our [Reddit Community](https://www.reddit.com/r/OnPatrolLive)");
const rulesMessage = { embeds: [rulesEmbed] };




const faqEmbed1 = new EmbedBuilder()
  .setColor(0x2B2D31)
  // .setTitle("Bingo")
  .setDescription("# How can I watch On Patrol: Live on Reelz?\n\
  You must have a valid subscription/trial with a cable, satellite, or streaming provider. Also see the [guide](https://www.reelz.com/extra/how-can-i-watch-on-patrol-live/) at reelz.com.\n\
\n\
  Check with your cable/satellite provider to see if they offer streaming options (most do).  Regional/country restrictions may apply.\n\
  ## Streaming services:\n\
  * **Peacock**:  \"Premium\" or \"Premium Plus\" package\n\
  * **Sling TV**: Orange or Blue Package + “Hollywood Extra” add-on package\n\
  * **Philo**: “Movies & More” add-on along with basic subscription\n\
  * **DirecTV Stream**: \"Entertainment\", \"Choice\", \"Ultimate\", or \"Premier\" package\n\
  * **FreeCast**: \"Value Channels\" package\n\
  Most of the streaming services offer free trials.\n\
  ## Cable and Satellite providers\n\
  Check with your cable/satellite provider to see if they offer streaming options (most do).\n\
  ## ReelzNow\n\
  If you have a subscription package that offers the Reelz channel, you can watch the Reelz channel live on [ReelzNow.com](https://www.reelznow.com/ ) with your subscription service login.");
const faqEmbed2 = new EmbedBuilder()
  .setColor(0x2B2D31)
  .setDescription("# When will the latest episode be available on demand?\n\
  * Peacock and other services will normally post the last episode within 48 hours after it aired live. There are frequently delays and they make no promises as to when an episode will appear on their service.\n\
  * Occasionally, episodes are removed from on demand availability without explanation. This is likely due to legal policies in place to protect the rights of those who appear on the show. So far, any episodes that were removed have returned.");
const faqMessage = { embeds: [faqEmbed1, faqEmbed2] };

const resourcesEmbed = new EmbedBuilder()
  .setColor(0x2B2D31)
  .setTitle("📖 Additional Resources")
  .setDescription("## 🔗 Links\n\
- [**r/OnPatrolLive**](<https://www.reddit.com/r/onpatrollive/>) - Our companion subreddit\n\
- [**That's a Bingo!**]( <https://www.thatsabingo.com/>) - Play bingo with us live, while you watch the show!\n\
## 🧭 Server Navigation\n\
- <id:customize> - Set or change your roles\n\
- <id:browse> - See more channels\n\
## 💬 Feedback\n\
- **Community Feedback** - You can send general community feedback to <@&343568731793915904> in the <#325206992413130753>.");
const resourcesMessage = { embeds: [resourcesEmbed] };

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
          { name: 'rules', value: 'post_rules' },
          { name: 'faq', value: 'post_faq' },
          { name: 'resources', value: 'post_resources' },
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
      case "post_rules": {
        postMessage = rulesMessage;
      }
        break;
      case "post_faq": {
        postMessage = faqMessage;
      }
        break;
      case "post_resources": {
        postMessage = resourcesMessage;
      }
        break;
    }
    await interaction.reply({ content: postReply, ephemeral: true });
    interaction.channel.send(postMessage);
  },
};

