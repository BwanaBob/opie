require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

const {
  Client,
  Collection,
  ActivityType,
  Events,
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
client.params.set("gifdelay", process.env.EMBED_DELAY);
client.params.set("chatGPTEnabled", process.env.CHATGPT_ENABLED);

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
    console.log(`[${uniDate1}] ⌛ CMD   | Command Loaded| ${command.data.name}`)
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

client.login(process.env.TOKEN);
