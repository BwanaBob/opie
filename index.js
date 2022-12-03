const { Client, ActivityType, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
] });

require("dotenv").config()

const gifexpr = new RegExp("(http|https|ftp):\/\/.*(.gif|-gif-|.png)")
const gifusers = {}
const gifDelay = 60

client.once(Events.ClientReady, c => {
    console.log(`Logged in as: ${c.user.username} (${c.user.tag})`)
    console.log(`Member of:`)
    c.guilds.cache.forEach(guild => {
        console.log(`  ${guild.id} - ${guild.name}`)
    })
    c.user.setActivity('with yarn', { type: ActivityType.Playing });
});

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

    // Bot user is 1041050338775539732
    // Bot role is 1046068702396825674
    if(message.content.match(/\b(opie|1041050338775539732|1046068702396825674)\b/gi)){
        message.react('👋')
        client.user.setActivity('with yarn', { type: ActivityType.Playing });
        console.log(`OPIE| ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag}) | said Opie`)
    }
    if(message.content.match(/\b(another|many|more)\W.*?\b(break|breaks|ad|ads|commercial|commercials|advert|adverts|advertisement|advertisements|break|breaks)\b/gi)){
        message.react('😠')
        
        console.log(`ADS | ${message.guild.name} | ${message.channel.name} | ${message.member.displayName} (${message.author.tag})`)

        // send notice to servers notice channel
        client.channels.cache.get(message.guild.publicUpdatesChannelId).send(
            `\`\`\`ansi\n`+
            `Rule violated: \u001b[1;37mMore Ads\u001b[0m\n`+
            `User: \u001b[1;37m${message.member.displayName} (${message.author.tag})\u001b[0m\n` + 
            `Channel: \u001b[1;37m${message.channel.name}\u001b[0m\n\`\`\``
        )

        // also send everything to bot's notice channel
        client.channels.cache.get("1045327770592497694").send(
            `\`\`\`ansi\n` +
            `Server: \u001b[1;37m${message.guild.name}\u001b[0m\n` +
            `Rule violated: \u001b[1;37mMore Ads\u001b[0m\n` +
            `User: \u001b[1;37m${message.member.displayName} (${message.author.tag})\u001b[0m\n` + 
            `Channel: \u001b[1;37m${message.channel.name}\u001b[0m\`\`\``
       )
    }

})

client.login(process.env.TOKEN)