module.exports = {
    name: "Cow",
    logName: "🐮 COW   ",
    regex: "\\b(cow|cows|368797989554356224)\\b",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            const reactions = [
                '<:cowcop:705958276210360391>',
                '<:cowcowboypensive:705961325695729754>',
                '<:cowheart:705960794101383258>',
                '<:cowmad:705961134930526289>',
                '<:cowsad:705960912732946492>',
                '<a:cowsiren:705958068361625611>',
                '<:cowsleep:705961477877530715>',
                '<:cowwink:705961033298346004>',
                '<:cowgrad:1111541609838944356>',
            ];
            const reaction = reactions[Math.floor(Math.random() * reactions.length)];
            message.react(reaction);
        } else {
            message.react('🐮')
        }
    }
}