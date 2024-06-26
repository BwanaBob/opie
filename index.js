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
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
});

const options = require("./options.json"); // start replacing .env variables and client.params with this

client.timers = new Collection();
client.params = new Collection();
client.params.set("attachmentDelay", options.defaults.attachmentDelay ?? "90");
client.params.set("chatGPTEnabled", options.defaults.chatGPTEnabled ?? "false");
client.params.set("chatGPTAnnouncementsEnabled", options.defaults.chatGPTAnnouncementsEnabled ?? "false");
client.params.set("twitterStreamEnabled", options.defaults.twitterStreamEnabled ?? "false");
client.params.set("messageReactionsEnabled", options.defaults.messageReactionsEnabled ?? "false");
client.params.set("statusRotationEnabled", options.defaults.statusRotationEnabled ?? "false");

// Watch Twitter Stream
const { ETwitterStreamEvent } = require("twitter-api-v2");
const exportTweetStream = require('./modules/twitterClient.js');
async function getTweetStream() {
  const stream = await exportTweetStream();
  // console.log(stream);
  const tConnectLogDate = new Date().toLocaleString();
  if ((stream === undefined) || (stream === "Failed")) {
    console.log(`[${tConnectLogDate}] 🐦 TWIT  | ⛔ Failed to connect`)
    return;
  } else {
    console.log(`[${tConnectLogDate}] 🐦 TWIT  | ✅ Connected`)
    // console.log(stream);
  }

  stream.on(ETwitterStreamEvent.Data, async tweet => {
    const announcementsChannel = client.channels.cache.get("1115429408614920303") || client.channels.cache.get("392093299890061312"); // OPL #announcements or OPie #general 
    const testChannel = client.channels.cache.get("392093299890061312"); // OPie #General
    // const discussionChannel = client.channels.cache.get("325207222814507018") || client.channels.cache.get("392093299890061312"); // OPL #episode-discussion or OPie #general 
    // const loungeChannel = client.channels.cache.get("325206992413130753") || client.channels.cache.get("392093299890061312"); // OPL #lounge or OPie #general 
    // const modChannel = client.channels.cache.get("1074313334217789460") || client.channels.cache.get("392120898909634561"); // OPL #mod-chat or OPie #bot-test 
    const tweetURL = `https://twitter.com/${tweet.includes.users[0].username}/status/${tweet.data.id}` || 'Unknown'

    const logDate = new Date().toLocaleString();
    console.log(`[${logDate}] 🐦 TWIT  | ${tweetURL}`)

    if (client.params.get("twitterStreamEnabled") == 'true') {
      const tweetTag = tweet.matching_rules[0].tag || "none"
      switch (tweetTag) {
        case 'lineup':
          try { client.users.send('629681401918390312', tweetURL); } // PM Barre
          catch (err) { console.error(`[ERROR] Sending tweet -`, err.message); }
        case 'ratings':
          try { announcementsChannel.send(tweetURL); }
          catch (err) { console.error(`[ERROR] Sending tweet -`, err.message); }
          break;
        default:
          try { testChannel.send(tweetURL).then((msg) => msg.pin()); }
          catch (err) { console.error(`[ERROR] Sending tweet -`, err.message); }
          break;
      }
    }
  });

  stream.on(ETwitterStreamEvent.ConnectionLost, async err => {
    const logDate = new Date().toLocaleString();
    console.error(`[${logDate}] 🐦 TWIT  | ⛔ Connection Lost`, err);
    client.channels.cache.get("1045327770592497694").send({ content: "🐦 TWITTER | ⛔ Connection Lost" });
  });
  stream.on(ETwitterStreamEvent.ConnectionClosed, async msg => {
    const logDate = new Date().toLocaleString();
    console.log(`[${logDate}] 🐦 TWIT  | 🔶 Connection Closed - ${msg}`)
    client.channels.cache.get("1045327770592497694").send({ content: "🐦 TWITTER | 🔶 Connection Closed" });
  });
  stream.on(ETwitterStreamEvent.Error, async err => { // combines ConnectionError & TweetParseError
    const logDate = new Date().toLocaleString();
    console.error(`[${logDate}] 🐦 TWIT  | ⛔ Connection Error - ${err.type}`, err.error)
    client.channels.cache.get("1045327770592497694").send({ content: `🐦 TWITTER | ⛔ Connection Error | ${err.type}` });
  });
  stream.on(ETwitterStreamEvent.ReconnectAttempt, async attemptNum => {
    const logDate = new Date().toLocaleString();
    console.log(`[${logDate}] 🐦 TWIT  | 🔶 Reconnecting - attempt # ${attemptNum}`)
    client.channels.cache.get("1045327770592497694").send({ content: `🐦 TWITTER | 🔶 Reconnecting        | Attempt: ${attemptNum}` });
  });
  stream.on(ETwitterStreamEvent.Reconnected, async msg => {
    const logDate = new Date().toLocaleString();
    console.log(`[${logDate}] 🐦 TWIT  | ✅ Reconnected - ${msg}`)
    client.channels.cache.get("1045327770592497694").send({ content: "🐦 TWITTER | ✅ Reconnected" });
  });
  stream.on(ETwitterStreamEvent.DataKeepAlive, async msg => {
    client.timers.set("TwitterKeepAlive", Math.floor(new Date().getTime() / 1000));
    // console.info(`[${logDate}] 🐦 TWIT  | 🔶 Keep Alive - ${aliveDate}`)
  });
  return stream;
}
// Remove until/unless Elon pulls his head out of his ass
// const dummyVal = getTweetStream();

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
    const cLoadedDate = new Date().toLocaleString();
    console.log(`[${cLoadedDate}] 💻 COMAND| Command Loaded| ${command.data.name}`)
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
    const rLoadedDate = new Date().toLocaleString();
    console.log(`[${rLoadedDate}] 👋 REACT | React Loaded  | ${reaction.name}`)
  } else {
    console.log(
      `⛔ [WARNING] The reaction at ${reactFilePath} is missing a required "name" or "execute" property.`
    );
  }
}

client.login(process.env.DISCORD_TOKEN);
