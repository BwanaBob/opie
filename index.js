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

const gifexpr = new RegExp("(http|https|ftp):\/\/.*(.gif|.png)")

const gifusers = {}

client.on("ready", () => {
    console.log(`Logged in as: ${client.user.tag}`)
})

client.on("messageCreate", (message) => {
//    console.log(`Message: ${message.content}`)

    if(gifexpr.test(message.content)){
        message.react('🔥')
    }

    if(message.content == "opie"){
        message.reply("I am not a robot")
        console.log(message.author.id)
        console.log(message.author.username)
        console.log(message.author.discriminator)
    }
})

client.login(process.env.TOKEN)