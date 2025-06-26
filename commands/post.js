const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, AttachmentBuilder, MessageFlags } = require("discord.js");

const postReply = `Posted`;

const kidsImage = new AttachmentBuilder("./resources/thumb-safe-place.png", { name: "thumb-safe-place.png" });
const kidsEmbed = new EmbedBuilder()
  .setColor(0xffce07)
  .setTitle("Explicit Content Warning")
  .setDescription("Please keep in mind that viewers under 18 years old join us.")
  .setThumbnail("attachment://thumb-safe-place.png");
const kidsMessage = { embeds: [kidsEmbed], files: [kidsImage] };

const ferretImage = new AttachmentBuilder("./resources/thumb-ferret.png", { name: "thumb-ferret.png" });
const ferretEmbed = new EmbedBuilder()
  .setColor(0xFF69B4)
  .setTitle("Ferret Warning")
  .setDescription("Please keep in mind that delicate ferrets are watching!")
  .setThumbnail("attachment://thumb-ferret.png");
const ferretMessage = { embeds: [ferretEmbed], files: [ferretImage] };

const bingoImage = new AttachmentBuilder("./resources/thumb-bingo.png", { name: "thumb-bingo.png" });
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
  .setThumbnail("attachment://thumb-bingo.png");
const bingoMessage = { embeds: [bingoEmbed], files: [bingoImage] };

const redditImage = new AttachmentBuilder("./resources/thumb-reddit.png", { name: "thumb-reddit.png" });
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
  .setThumbnail("attachment://thumb-reddit.png");
const redditMessage = { embeds: [redditEmbed], files: [redditImage] };

const showtimeImage = new AttachmentBuilder("./resources/thumb-opl.png", { name: "thumb-opl.png" });
const showtimeBanner = new AttachmentBuilder("./resources/banner-no-text.png", { name: "banner-no-text.png" });
const showtimeEmbed = new EmbedBuilder()
  .setColor(0x0000ff)
  .setTitle("Showtime")
  .setDescription("Welcome and enjoy the show!\nPlease read the rules before posting.")
  .setThumbnail("attachment://thumb-opl.png")
  .setImage("attachment://banner-no-text.png")
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
const showtimeMessage = { embeds: [showtimeEmbed], files: [showtimeImage, showtimeBanner] };

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

const rulesAttach = new AttachmentBuilder("./resources/rules-banner.png", { name: 'rules.png' })
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
const rulesMessage = {
  files: [rulesAttach],
  embeds: [rulesEmbed]
};

const faqAttach = new AttachmentBuilder("./resources/faq-banner.png", { name: 'faq.png' })
const faqEmbed1 = new EmbedBuilder()
  .setColor(0x2B2D31)
  // .setTitle("Bingo")
.setDescription("# How can I watch On Patrol: Live on REELZ?\n\
You must have a valid subscription/trial with a cable, satellite, or streaming provider. Also see the [guide](https://www.reelz.com/extra/how-can-i-watch-on-patrol-live/) at REELZ.com.\n\
\n\
Check with your cable/satellite provider to see if they offer streaming options (most do).  Regional/country restrictions may apply.\n\
## Streaming services:\n\
* **REELZ Plus**:  \"Monthly\" or \"Yearly\"\n\
* **Peacock**:  \"Premium\" or \"Premium Plus\" package\n\
* **Sling TV**: Orange or Blue Package + “Hollywood Extra” add-on package\n\
* **Philo**: “Movies & More” add-on along with basic subscription\n\
* **DirecTV Stream**: \"Entertainment\", \"Choice\", \"Ultimate\", or \"Premier\" package\n\
* **FreeCast**: \"Value Channels\" package\n\
Most of the streaming services offer free trials.\n\
# Cable and Satellite providers\n\
Check with your cable/satellite provider to see if they offer streaming options (most do).\n\
## REELZ Now and REELZ Plus\n\
If you have a subscription package that offers the REELZ channel, you can watch REELZ live at [REELZNow.com](https://www.reelznow.com/ ) and [REELZPlus.com](https://reelzplus.com/) with your subscription service login.");
const faqEmbed2 = new EmbedBuilder()
  .setColor(0x2B2D31)
  .setDescription("# When will the latest episode be available on demand?\n\
* Peacock and other services will normally post the last episode within 48 hours after it aired live. There are frequently delays and they make no promises as to when an episode will appear on their service.\n\
* Occasionally, episodes are removed from on demand availability without explanation. This is likely due to legal policies in place to protect the rights of those who appear on the show. So far, any episodes that were removed have returned.");
const faqMessage = {
  files: [faqAttach],
  embeds: [faqEmbed1, faqEmbed2]
};

const resourcesAttach = new AttachmentBuilder("./resources/resources-banner.png", { name: 'resources.png' })
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
- **Community Feedback** - The <#1211792503175520346> channel is your go-to place to share your thoughts, ideas, and suggestions to help us enhance your OPL viewing experience. Whether you have ideas for Discord, Reddit, Bingo, or have feedback on our bots - this is the spot.");
const resourcesMessage = {
  files: [resourcesAttach],
  embeds: [resourcesEmbed]
};

const modPermissionsDescription1 = "# Managing Permissions\n\
Permissions control a users ability to view channels and what abilities they have on them as well as what changes they can make to the server and other users.\n\
Permissions exist on Roles, Groups, and Channels\n\
## Channel visibility and features\n\
### Ideal Setup\n\
- Categories should determine what channels each role can see. \n\
- Roles should determine a persons abilities on every channel they can see. \n\
- Channels and Categories should have no permissions settings (exceptions below). \n\
- Vanity and Notification roles should have permissions cleared. \n\
- The only place any permissios should be set is on the following roles (exceptions below):\n\
  * Moderator\n\
  * everyone\n\
  * Server Booster\n\
* Bots\n\
    - OPie\n\
    - Jake\n\
    - Kudos\n\
    - Midjourney Bot"

const modPermissionsDescription2 = "### Role Permissions \n\
\n\
Mod/Everyone/Booster | Name \n\
✅ ✅ ⬛ | View Channels \n\
⛔ ⛔ ⬛ | Manage Channels \n\
⛔ ⛔ ⬛ | Manage Roles \n\
⛔ ⛔ ⬛ | Create Expressions \n\
⛔ ⛔ ⬛ | Manage Expressions \n\
⛔ ⛔ ⬛ | View Audit Log \n\
✅ ⛔ ⬛ | View Server Insights \n\
⛔ ⛔ ⬛ | Manage Webhooks \n\
⛔ ⛔ ⬛ | Manage Server \n\
✅ ⛔ ⬛ | Create Invite \n\
✅ ✅ ⬛ | Change Nickname \n\
✅ ⛔ ⬛ | Manage Nicknames \n\
✅ ⛔ ⬛ | Kick, Approve, and Reject Members \n\
✅ ⛔ ⬛ | Ban Members \n\
✅ ⛔ ⬛ | Timeout Members \n\
✅ ✅ ⬛ | Send Messages \n\
✅ ✅ ⬛ | Send Messages in Threads \n\
✅ ✅ ⬛ | Create Public Threads \n\
✅ ⛔ ✅ | Create Private Threads \n\
✅ ✅ ⬛ | Embed Links \n\
✅ ✅ ⬛ | Attach Files \n\
✅ ✅ ⬛ | Add Reactions \n\
✅ ✅ ⬛ | Use External Emoji \n\
✅ ✅ ⬛ | Use External Stickers \n\
✅ ⛔ ⬛ | Mention @everyone, etc \n\
✅ ⛔ ⬛ | Manage Messages \n\
✅ ⛔ ⬛ | Manage Threads \n\
✅ ✅ ⬛ | Read Message History \n\
✅ ⛔ ⬛ | Send TTS Messages \n\
✅ ⛔ ✅ | Send Voice Messages \n\
✅ ⛔ ✅ | Create Polls \n\
✅ ✅ ⬛ | Connect \n\
✅ ✅ ⬛ | Speak \n\
✅ ⛔ ✅ | Video \n\
✅ ✅ ⬛ | Use Soundboard \n\
✅ ⛔ ✅ | Use External Sounds \n\
✅ ✅ ⬛ | Use Voice Activity \n\
✅ ⛔ ⬛ | Priority Speaker \n\
✅ ⛔ ⬛ | Mute Members \n\
✅ ⛔ ⬛ | Deafen Members \n\
✅ ⛔ ⬛ | Move Members \n\
✅ ⛔ ⬛ | Set Voice Channel Status \n\
✅ ✅ ⬛ | Use Application Commands \n\
✅ ✅ ⬛ | Use Activities \n\
✅ ⛔ ⬛ | Use External Apps \n\
✅ ✅ ⬛ | Request to Speak \n\
✅ ⛔ ⬛ | Create Events \n\
✅ ⛔ ⬛ | Manage Events \n\
⛔ ⛔ ⬛ | **Administrator**"

const modPermissionsDescription3 = "## Exceptions\n\
### Retired Channels Visibility \n\
These are restricted to specific users that could view them at the time the channel was active. Those channels are not synced with their category. Features should still be determined by the users roles, however. So, add users to the channel, do not modify the radio buttons below. \n\
### Resources Category\n\
The **Send Message** permission will be restricted on this category for **everyone**. OPie has Send messages enabled. All Channels will have permissions synced with the category.\n\
### Announcements Channel\n\
#announcements is a special channel with the **Announcements Channel** setting selected.\n\
the **everyone** role has **Send Messages** disabled on this channel.\n\
### Bingo-Mod Channel\n\
This channel is not synced with it's category\n\
**View Channel** is disabled for **everyone**.\n\
**Moderator** and **Bingo Moderator** are added so they can view it. No permissions need to be set.\n\
## Additional Channel Settings\n\
#episode-discussion and #lounge currently have **slow mode** enabled and set to 10 seconds.";

const modPermissionsEmbed1 = new EmbedBuilder()
  .setColor(0x2B2D31)
  .setDescription(modPermissionsDescription1 + "\n" + modPermissionsDescription3);

const modPermissionsEmbed2 = new EmbedBuilder()
  .setColor(0x2B2D31)
  .setDescription(modPermissionsDescription2);

// const modPermissionsEmbed3 = new EmbedBuilder()
//   .setColor(0x2B2D31)
//   .setDescription(modPermissionsDescription3);

const modPermissionsMessage = {
  embeds: [modPermissionsEmbed1, modPermissionsEmbed2]
};

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
          { name: 'moderation', value: 'post_moderation' },
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
      case "post_moderation": {
        postMessage = modPermissionsMessage;
      }
        break;
    }
    await interaction.reply({ 
      content: postReply, 
      flags: MessageFlags.Ephemeral
    })
    .catch(err => { console.error(`[ERROR] Relpying to command ${message.id} -`, err.message); });
    interaction.channel.send(postMessage)
    .catch(err => { console.error(`[ERROR] Posting message ${message.id} -`, err.message); });
  },
};

