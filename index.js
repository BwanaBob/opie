require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

const {
  Client,
  Collection,
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
client.params.set("messageReactionsEnabled", process.env.OPTION_MESSAGE_REACTIONS_ENABLED ?? false);

// Watch Twitter Stream
const { ETwitterStreamEvent } = require("twitter-api-v2");
const exportTweetStream = require('./modules/twitterClient.js');
async function getTweetStream() {
  const stream = await exportTweetStream();
  // console.log(stream);
  const uniDate2 = new Date().toLocaleString();
  if ((stream === undefined) || (stream === "Failed")) {
    console.log(`[${uniDate2}] 🐦 TWIT  | ⛔ Failed to connect`)
    return;
  } else {
    console.log(`[${uniDate2}] 🐦 TWIT  | ✅ Connected`)
    // console.log(stream);
  }

  stream.on(ETwitterStreamEvent.Data, async tweet => {
    const modChannel = client.channels.cache.get("1074313334217789460") || client.channels.cache.get("392120898909634561"); // OPL #mod-chat or OPie #bot-test 
    const tweetChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #episode-discussion or OPie #general 
    const testChannel = client.channels.cache.get("392093299890061312"); // OPie #General
    const tweetURL = `https://twitter.com/${tweet.includes.users[0].username}/status/${tweet.data.id}` || 'Unknown'

    const uniDate1 = new Date().toLocaleString();
    console.log(`[${uniDate1}] 🐦 TWIT  | ${tweetURL}`)

    if (client.params.get("twitterStreamEnabled") == 'true') {
      const tweetTag = tweet.matching_rules[0].tag || "none"
      switch (tweetTag) {
        case 'lineup':
        case 'ratings':
          // case 'travel':
          tweetChannel.send(tweetURL).then((msg) => msg.pin());
          modChannel.send(tweetURL);
          break;
        default:
          testChannel.send(tweetURL);
          break;
      }
    }
  });

  stream.on(ETwitterStreamEvent.ConnectionLost, async err => {
    const logTime = new Date().toLocaleString();
    console.error(`[${logTime}] 🐦 TWIT  | ⛔ Connection Lost`, err);
    client.channels.cache.get("1045327770592497694").send({ content: "🐦 TWITTER | ⛔ Connection Lost" });
  });
  stream.on(ETwitterStreamEvent.ConnectionClosed, async msg => {
    const logTime = new Date().toLocaleString();
    console.log(`[${logTime}] 🐦 TWIT  | 🔶 Connection Closed - ${msg}`)
    client.channels.cache.get("1045327770592497694").send({ content: "🐦 TWITTER | 🔶 Connection Closed" });
  });
  stream.on(ETwitterStreamEvent.Error, async err => { // combines ConnectionError & TweetParseError
    const logTime = new Date().toLocaleString();
    console.error(`[${logTime}] 🐦 TWIT  | ⛔ Connection Error - ${err.type}`, err.error)
    client.channels.cache.get("1045327770592497694").send({ content: `🐦 TWITTER | ⛔ Connection Error\n${err.type}\n${err.error}` });
  });
  stream.on(ETwitterStreamEvent.ReconnectAttempt, async attemptNum => {
    const logTime = new Date().toLocaleString();
    console.log(`[${logTime}] 🐦 TWIT  | 🔶 Reconnecting - attempt # ${attemptNum}`)
    client.channels.cache.get("1045327770592497694").send({ content: `🐦 TWITTER | 🔶 Reconnecting - attempt # ${attemptNum}`});
  });
  stream.on(ETwitterStreamEvent.Reconnected, async msg => {
    const logTime = new Date().toLocaleString();
    console.log(`[${logTime}] 🐦 TWIT  | ✅ Reconnected - ${msg}`)
    client.channels.cache.get("1045327770592497694").send({ content: "🐦 TWITTER | ✅ Reconnected" });
  });
    stream.on(ETwitterStreamEvent.DataKeepAlive, async msg => {
    client.timers.set("TwitterKeepAlive", Math.floor(new Date().getTime() / 1000));
    // console.log(`[${logTime}] 🐦 TWIT  | 🔶 Keep Alive - ${aliveDate}`)
  });
  return stream;
}
const dummyVal = getTweetStream();

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// Slash command Collection setup
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    const uniDate1 = new Date().toLocaleString();
    console.log(`[${uniDate1}] 💻 COMAND| Command Loaded| ${command.data.name}`)
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

// Reactions Collection setup - See messageCreate.js event for processing of reactions
client.reactions = new Collection();
const reactionsPath = path.join(__dirname, "reactions");
const reactionFiles = fs
  .readdirSync(reactionsPath)
  .filter((file) => file.endsWith(".js"));

for (const reactFile of reactionFiles) {
  const reactFilePath = path.join(reactionsPath, reactFile);
  const reaction = require(reactFilePath);
  // Set a new item in the Collection with the key as the reaction name and the value as the exported module
  if ("name" in reaction && "execute" in reaction) {
    client.reactions.set(reaction.name, reaction);
    const uniDate1 = new Date().toLocaleString();
    console.log(`[${uniDate1}] 👋 REACT | React Loaded  | ${reaction.name}`)
  } else {
    console.log(
      `⛔ [WARNING] The reaction at ${reactFilePath} is missing a required "name" or "execute" property.`
    );
  }
}

client.login(process.env.DISCORD_TOKEN);
