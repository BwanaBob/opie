const { GatewayIntentBits } = require("discord.js")
const Discord = require("discord.js")
require("dotenv").config()
const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

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
                message.author.send(`Sorry, the server "${message.guild.name}" has limited the posting of gifs to once every ${gifDelay} seconds.`)
                // send notice to servers notice channel
                client.channels.cache.get(message.guild.publicUpdatesChannelId).send(
                    `>>> **Rule violated**: GIF Timer\n**User**: ${message.author.username}#${message.author.discriminator}\n**Channel**: ${message.channel.name}\n**Time**: <t:${Math.round(message.createdTimestamp /1000)}>`
                    )
                // also send everything to bot's notice channel
                client.channels.cache.get("1045327770592497694").send(
                    `>>> **Server**: ${message.guild.name} - ${message.guildId}\n**Rule violated**: GIF Timer\n**User**: ${message.author.username}#${message.author.discriminator}\n**Channel**: ${message.channel.name}\n**Notice Channel**: ${message.guild.publicUpdatesChannelId}\n**Time**: <t:${Math.round(message.createdTimestamp /1000)}>`
                    )

            } else {
                console.log(`GIF: ${message.guild.name} (${message.author.username}-${message.author.discriminator})-${elapsed}=OK`)
                gifusers[ThisAuth] = message.createdTimestamp
//                message.react('✅')
            }
        }
    }

    if(message.content == "opie"){
        message.react('👋')
//        let chans = message.guild.publicUpdatesChannelId
//        console.log(chans)
    }
})

client.login(process.env.TOKEN)