const Discord = require("discord.js")
require("dotenv").config()
const client = new Discord.Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "MessageContent"
    ]
})

client.on("ready", () => {
    console.log(`Logged in as: ${client.user.tag}`)
})

client.on("messageCreate", (message) => {
//    console.log(`Message: ${message.content}`)
//    console.log(`Message: ${message.id}`)
    if(message.content == "opie"){
        message.reply("I am not a robot")
    }
})

client.login(process.env.TOKEN)