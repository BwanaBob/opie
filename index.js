require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

const {
  Client,
  Collection,
  ActivityType,
  Events,
  AttachmentBuilder,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
});

client.timers = new Collection();
client.params = new Collection();
client.params.set("attachmentDelay", process.env.OPTION_ATTACHMENT_DELAY ?? 90);
client.params.set("chatGPTEnabled", process.env.OPTION_CHATGPT_ENABLED ?? false);
client.params.set("chatGPTAnnouncementsEnabled", process.env.OPTION_CHATGPT_ANNOUNCEMENTS_ENABLED ?? false);
client.params.set("twitterStreamEnabled", process.env.OPTION_TWITTER_STREAM_ENABLED ?? false);

// Watch Twitter Stream
const { ETwitterStreamEvent } = require("twitter-api-v2");
const exportTweetStream = require('./modules/twitterClient.js');
async function getTweetStream() {
  const stream = await exportTweetStream();
  // console.log(stream);
if (stream === undefined || stream === "Failed"){ return;}

  stream.on(ETwitterStreamEvent.Data, async tweet => {
    const tweetChannel = client.channels.cache.get("1074313334217789460") || client.channels.cache.get("392093299890061312"); // OPL #mod-chat or OPie #general 
    const tweetURL = `https://twitter.com/${tweet.includes.users[0].username}/status/${tweet.data.id}` || 'Unknown'

    const uniDate1 = new Date().toLocaleString();
    console.log(`[${uniDate1}] 🐦 TWIT| ${tweetURL}`)

    if (client.params.get("twitterStreamEnabled") == 'true') {
      tweetChannel.send(tweetURL);
      // const tweetAttachment = new AttachmentBuilder(`${tweetURL}`);
      // tweetChannel.send({ files: [tweetAttachment] });
    }
  });

  stream.on('error', error => {
    console.error('Error:', error);
  });

  return stream ?? "Failed";
}
const dummyVal = getTweetStream();

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

console.log(`____________________________________________________`);

// Slash command Collection setup
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    const uniDate1 = new Date().toLocaleString();
    console.log(`[${uniDate1}] 👉 CMD   | Command Loaded| ${command.data.name}`)
  } else {
    console.log(
      `⛔ [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

//events handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);
