const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, AttachmentBuilder } = require("discord.js");

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
# Cable and Satellite providers\n\
Check with your cable/satellite provider to see if they offer streaming options (most do).\n\
## ReelzNow\n\
If you have a subscription package that offers the Reelz channel, you can watch the Reelz channel live on [ReelzNow.com](https://www.reelznow.com/ ) with your subscription service login.");
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
- **Community Feedback** - You can send general community feedback to <@&343568731793915904> in the <#325206992413130753>.");
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
  * Bots\n\
    - OPie\n\
    - Jake\n\
    - Kudos\n\
    - Midjourney Bot"

const modPermissionsDescription2 = "### Role Permissions \n\
\n\
Mod/Everyone | Name \n\
:white_check_mark: :white_check_mark: | View Channels \n\
:no_entry: :no_entry: | Manage Channels \n\
:no_entry: :no_entry: | Manage Roles \n\
:no_entry: :no_entry: | Create Expressions \n\
:no_entry: :no_entry: | Manage Expressions \n\
:no_entry: :no_entry: | View Audit Log \n\
:white_check_mark: :no_entry: | View Server Insights \n\
:no_entry: :no_entry: | Manage Webhooks \n\
:no_entry: :no_entry: | Manage Server \n\
:white_check_mark: :no_entry: | Create Invite \n\
:white_check_mark: :white_check_mark: | Change Nickname \n\
:white_check_mark: :no_entry: | Manage Nicknames \n\
:white_check_mark: :no_entry: | Kick Members \n\
:white_check_mark: :no_entry: | Ban Members \n\
:white_check_mark: :no_entry: | Timeout Members \n\
:white_check_mark: :white_check_mark: | Send Messages \n\
:white_check_mark: :white_check_mark: | Send Messages in Threads \n\
:white_check_mark: :no_entry: | Create Public Threads \n\
:white_check_mark: :no_entry: | Create Private Threads \n\
:white_check_mark: :white_check_mark: | Embed Links \n\
:white_check_mark: :white_check_mark: | Attach Files \n\
:white_check_mark: :white_check_mark: | Add Reactions \n\
:white_check_mark: :white_check_mark: | Use External Emoji \n\
:white_check_mark: :white_check_mark: | Use External Stickers \n\
:white_check_mark: :no_entry: | Mention @everyone, etc \n\
:white_check_mark: :no_entry: | Manage Messages \n\
:white_check_mark: :no_entry: | Manage Threads \n\
:white_check_mark: :white_check_mark: | Read Message History \n\
:white_check_mark: :no_entry: | Send TTS Messages \n\
:white_check_mark: :white_check_mark: | Use Application Commands \n\
:white_check_mark: :no_entry: | Send Voice Messages \n\
:white_check_mark: :white_check_mark: | Connect \n\
:white_check_mark: :white_check_mark: | Speak \n\
:white_check_mark: :no_entry: | Video \n\
:white_check_mark: :white_check_mark: | Use Activities \n\
:white_check_mark: :white_check_mark: | Use Soundboard \n\
:white_check_mark: :no_entry: | Use External Sounds \n\
:white_check_mark: :white_check_mark: | Use Voice Activity \n\
:white_check_mark: :no_entry: | Priority Speaker \n\
:white_check_mark: :no_entry: | Mute Members \n\
:white_check_mark: :no_entry: | Deafen Members \n\
:white_check_mark: :no_entry: | Move Members \n\
:white_check_mark: :no_entry: | Set Voice Channel Status \n\
:white_check_mark: :white_check_mark: | Request to Speak \n\
:white_check_mark: :no_entry: | Create Events \n\
:white_check_mark: :no_entry: | Manage Events \n\
:no_entry: :no_entry: | **Administrator**"

const modPermissionsDescription3 = "## Exceptions\n\
###  #off-topic threads\n\
The @member role has **Create Public Threads** enabled on this channel only. \n\
### Retired Channels Visibility \n\
These are restricted to specific users that could view them at the time the channel was active. Those channels are not synced with their category. Features should still be determined by the users roles, however. So, add users to the channel, do not modify the radio buttons below. \n\
### Resources Category\n\
The **Send Message** permission will be restricted on this category for **everyone**. All Channels will have permissions synced with the category.\n\
### Announcements Channel\n\
#announcements is a special channel with the **Announcements Channel** setting selected.\n\
the **everyone** role has **Send Messages** disabled on this channel.\n\
### Bingo-Mod Channel\n\
This channel is not synced with it's category\n\
**View Channel** is disabled for **everyone**.\n\
**Moderator** and **Bingo Moderator** are added so they can view it. No permissions need to be set.\n\
### Community Category\n\
**everyone** has **View Channel** disabled\n\
**member** is added to the category to provide visibility\n\
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
    await interaction.reply({ content: postReply, ephemeral: true });
    interaction.channel.send(postMessage);
  },
};

