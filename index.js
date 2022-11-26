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
const gifDelay = 60 * 1000

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
            console.log(`GIF: ${ThisAuth} (${message.author.username}-${message.author.discriminator}) - not found`)
//            message.react('✅')
            gifusers[ThisAuth] = message.createdTimestamp
        } else {
//            console.log(`Author: ${ThisAuth} (${message.author.username}-${message.author.discriminator}) - ${gifusers[ThisAuth]}-${message.createdTimestamp}`)
            if(gifusers[ThisAuth] + gifDelay > message.createdTimestamp) {
                console.log(`GIF: ${ThisAuth} (${message.author.username}-${message.author.discriminator}) - ${gifusers[ThisAuth]}-${message.createdTimestamp}=BAD`)
//                message.react('❎')
                message.delete()
            } else {
                console.log(`GIF: ${ThisAuth} (${message.author.username}-${message.author.discriminator}) - ${gifusers[ThisAuth]}-${message.createdTimestamp}=OK`)
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