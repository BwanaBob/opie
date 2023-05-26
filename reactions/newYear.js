module.exports = {
    name: "NewYear",
    logName: "🥂 NEW YR",
    regex: "\\b(happy\\Wnew\\Wyear)\\b",
    async execute(message) {
        if (message.guild.id == "325206992413130753") {
            const reactions = [
                "🥳",
                "🎉",
                "🥂",
                "🎆",
                "🎇",
                "🎊",
                `<a:partying:1040138276692033556>`,
                `<a:party_blob:1038194657848463370>`,
                `<a:party_popper:1038207072485003274>`,
                `<a:bottle_with_popping_cork:1056931540283699282>`,
                `<a:firework:1010870326667788298>`,
                `<a:cat_jump:1040302608813924415>`,
                `<a:confetti_ball_animated:1056947556241903636>`,
            ];
            const reaction = reactions[Math.floor(Math.random() * reactions.length)];
            message.react(reaction);
        } else {
            message.react(`🥂`);
        }
    }
}