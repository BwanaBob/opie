const { GatewayIntentBits } = require("discord.js")
const Discord = require("discord.js")
const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
require("dotenv").config()

const gifexpr = new RegExp("(http|https|ftp):\/\/.*(.gif|-gif-|.png)")
const gifusers = {}
const gifDelay = 60

client.on("ready", () => {
    console.log(`Logged in as: ${client.user.tag}`)
})

client.on("messageCreate", (message) => {

    if(gifexpr.test(message.content)){
        ThisAuth = `${message.author.id}-${message.guildId}`

        if(gifusers[ThisAuth] == undefined){
            console.log(`GIF: ${message.guild.name} (${message.author.username}-${message.author.discriminator})-First GIF`)
            gifusers[ThisAuth] = message.createdTimestamp
        } else {
            let elapsed = Math.trunc((message.createdTimestamp - gifusers[ThisAuth]) /1000)
            if(elapsed < gifDelay) {
                console.log(`GIF: ${message.guild.name} (${message.author.username}-${message.author.discriminator})-${elapsed}=BAD`)
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
                    `User: \u001b[1;37m${message.author.username}#${message.author.discriminator} (${message.member.displayName})\u001b[0m\n`+
                    `Channel: \u001b[1;37m${message.channel.name}\u001b[0m\n\`\`\``
                    )
                // also send everything to bot's notice channel
                client.channels.cache.get("1045327770592497694").send(
                    `\`\`\`ansi\n` +
                    `Server: \u001b[1;37m${message.guild.name}\u001b[0m\n` +
                    `Rule violated: \u001b[1;37mGIF Timer\u001b[0m\n` +
                    `User: \u001b[1;37m${message.author.username}#${message.author.discriminator} (${message.member.displayName})\u001b[0m\n` + 
                    `Channel: \u001b[1;37m${message.channel.name}\u001b[0m\`\`\``
                    )
                // "<t:${Math.round(message.createdTimestamp /1000)}>"
            } else {
                console.log(`GIF: ${message.guild.name} (${message.author.username}-${message.author.discriminator})-${elapsed}=OK`)
                gifusers[ThisAuth] = message.createdTimestamp
//                message.react('✅')
            }
        }
    }

    if(message.content == "opie"){
        message.react('👋')
        let chans = message.guild.publicUpdatesChannel.name
        let chans2 = message.guild.systemChannel.name
        console.log(`Public updates: ${chans}`)
        console.log(`System channel: ${chans2}`)
    }
})

client.login(process.env.TOKEN)