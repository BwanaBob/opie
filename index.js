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
//    console.log(`Message: ${message.content}`)

    if(gifexpr.test(message.content)){
        ThisAuth = `${message.author.id}-${message.guildId}`
//        message.reply("I am not a robot")
//        console.log(`Author: ${ThisAuth} (${message.author.username}-${message.author.discriminator})`)

        if(gifusers[ThisAuth] == undefined){
            console.log(`GIF: ${message.guild.name} (${message.author.username}-${message.author.discriminator})-First GIF`)
//            message.react('✅')
            gifusers[ThisAuth] = message.createdTimestamp
        } else {
            let elapsed = Math.trunc((message.createdTimestamp - gifusers[ThisAuth]) /1000)
            if(elapsed < gifDelay) {
                console.log(`GIF: ${message.guild.name} (${message.author.username}-${message.author.discriminator})-${elapsed}=BAD`)
//                message.react('❎')
                message.delete()
                message.author.send(`Sorry, the server "${message.guild.name}" has limited the posting of gifs to once every ${gifDelay} seconds.`)
            } else {
                console.log(`GIF: ${message.guild.name} (${message.author.username}-${message.author.discriminator})-${elapsed}=OK`)
                gifusers[ThisAuth] = message.createdTimestamp
//                message.react('✅')
            }
        }
    }

    if(message.content == "opie"){
        message.react('👋')
    }
})

client.login(process.env.TOKEN)