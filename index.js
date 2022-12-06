require("dotenv").config()
const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, ActivityType, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
] });

const gifexpr = new RegExp("(http|https|ftp):\/\/.*(.gif|-gif-|.png)")
const gifusers = {}
const gifDelay = 60

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Slash command Collection setup
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


//events handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


//process rules
//major overhaul to do here
client.on("messageCreate", (message) => {
    // 343568731793915904  - exempt mod role id
    if(gifexpr.test(message.content) && !message.member.roles.cache.has('343568731793915904')){
        ThisAuth = `${message.author.id}-${message.guildId}`
        if(gifusers[ThisAuth] == undefined){
            console.log(`GIF | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | First GIF`)
            gifusers[ThisAuth] = message.createdTimestamp
        } else {
            let elapsed = Math.trunc((message.createdTimestamp - gifusers[ThisAuth]) /1000)
            if(elapsed < gifDelay) {
                console.log(`GIF | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${elapsed} = BAD`)
//                message.react('❎')
                message.delete()

                // send notice to user
                // message.author.send(`Sorry, the server "${message.guild.name}" has limited the posting of gifs to once every ${gifDelay} seconds.`)
                message.author.send(
                    `\`\`\`ansi\n`+
                    `The server \u001b[1;37m${message.guild.name}\u001b[0m has limited the posting of gifs to once every \u001b[1;37m${gifDelay}\u001b[0m seconds.\`\`\``
                    )
                // send notice to servers notice channel
                // publicUpdatesChannel = Community Updates
                // systemChannel = System Messages (New users)
                client.channels.cache.get(message.guild.publicUpdatesChannelId).send(
                    `\`\`\`ansi\n`+
                    `Rule violated: \u001b[1;37mGIF Timer\u001b[0m\n`+
                    `User: \u001b[1;37m${message.member.displayName} (${message.author.tag})\u001b[0m\n` + 
                    `Channel: \u001b[1;37m${message.channel.name}\u001b[0m\n\`\`\``
                    )
                // also send everything to bot's notice channel
                client.channels.cache.get("1045327770592497694").send(
                    `\`\`\`ansi\n` +
                    `Server: \u001b[1;37m${message.guild.name}\u001b[0m\n` +
                    `Rule violated: \u001b[1;37mGIF Timer\u001b[0m\n` +
                    `User: \u001b[1;37m${message.member.displayName} (${message.author.tag})\u001b[0m\n` + 
                    `Channel: \u001b[1;37m${message.channel.name}\u001b[0m\`\`\``
                    )
                // "<t:${Math.round(message.createdTimestamp /1000)}>"
            } else {
                console.log(`GIF | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | ${elapsed} = OK`)
                gifusers[ThisAuth] = message.createdTimestamp
//                message.react('✅')
            }
        }
    }
})

client.login(process.env.TOKEN)