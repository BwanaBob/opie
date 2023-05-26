module.exports = {
    name: "Pooph",
    logName: "💩 POOPH ",
    regex: "(pooph|poopf)",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            message.react(`<:poop_and_flowers:1070396627887603874>`);
        } else {
            message.react(`💩`);
        }
    }
}