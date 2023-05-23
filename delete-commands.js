// https://discordjs.guide/slash-commands/deleting-commands.html#deleting-all-commands
const { REST, Routes } = require("discord.js");
//const { clientId, guildId, token } = require('./config.json');
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
const guildId = process.env.DISCORD_COMMAND_GUILD_ID;
const clientId = process.env.DISCORD_CLIENT_ID;

const rest = new REST({ version: "10" }).setToken(token);

// ...

// for guild-based commands
rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
  .then(() => console.log("Successfully deleted all guild commands."))
  .catch(console.error);

// for global commands
rest
  .put(Routes.applicationCommands(clientId), { body: [] })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);
