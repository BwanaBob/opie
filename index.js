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

// Features Collection setup
client.features = new Collection();
const featuresPath = path.join(__dirname, "features");
const featureFiles = fs
  .readdirSync(featuresPath)
  .filter((file) => file.endsWith(".js"));

for (const file of featureFiles) {
  const filePath = path.join(featuresPath, file);
  const feature = require(filePath);
  // Set a new item in the Collection with the key as the feature name and the value as the exported module
  if ("name" in feature && "execute" in feature) {
    client.features.set(feature.name, feature);
    const fLoadedDate = new Date().toLocaleString();
    console.log(`[${fLoadedDate}] 🎯 FEATURE| Feature Loaded| ${feature.name}`)
  } else {
    console.log(
      `⛔ [WARNING] The feature at ${filePath} is missing a required "name" or "execute" property.`
    );
  }
}


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
