module.exports = {
    name: "OPie",
    logName: "👋 OPie  ",
    regex: "\\b(opie|1041050338775539732|1046068702396825674)\\b",
    async execute(message) {
        var reaction = "👋";
        if (message.guild.id == "325206992413130753") {
            const reactions = {
                default: "👋",
                member: {
                    "348629137080057878": `<:arctic_fox:1057115452553314354>`, // bwana
                    "629681401918390312": [
                        `<a:purple_heart_beating:1038193897337270352>`,
                        `<a:sloth_animated:1038514444289978479>`,
                    ], // barre
                    "511074631239598080": [
                        `<:ferret:1079139863544201224>`,
                        `<a:blue_heart_beating:1040127801879179354>`,
                    ], // ferret
                    "342487311860367362": "🔨", // wub
                    "440328038337478657": `<:sausage_thumbs_up:1039959562553401445>`, // saucy
                    "475145905117593623": [`<:suspicious_fry:1027310519910154330>`, `🏹`, `❤️`], // china
                    "368797989554356224": `<:cowheart:705960794101383258>`, // cow
                },
            };
            const memberReaction =
                reactions.member[message.member.id] || reactions.default;
            if (Array.isArray(memberReaction)) {
                reaction =
                    memberReaction[Math.floor(Math.random() * memberReaction.length)];
            } else {
                reaction = memberReaction;
            }
        }
        message.react(reaction);

    }
}