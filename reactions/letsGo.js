module.exports = {
    name: "LetsGo",
    logName: "🚨 LETSGO",
    regex: "(here we|lets|let's) go",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<a:police_car_light:1038193703854030878>`);
        } else {
            message.react(`🚨`);
        }
    }
}