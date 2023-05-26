module.exports = {
    name: "Jaws",
    logName: "🦈 JAWS  ",
    regex: "jaws(?! of life)",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<:jaws:1093958471394791617>`);
          } else {
            message.react(`🦈`);
          }
    }
}