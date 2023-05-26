module.exports = {
    name: "GoodKitty",
    logName: "😻 GD CAT",
    regex: "(good|great|best|wonderful|pretty).(kitty|cat|kitten|feline)",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<a:cat_heart_eyes:1109155796056539227>`);
        } else {
            message.react('😻')
        }
    }
}