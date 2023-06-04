module.exports = {
    name: "LetsGo",
    logName: "🚨 LETSGO",
    regex: "\\b(here we|lets|let's) go\\b",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<a:police_car_light:1038193703854030878>`);
        } else {
            message.react(`🚨`);
        }
    }
}