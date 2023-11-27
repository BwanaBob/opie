module.exports = {
    name: "PodBay",
    logName: "🤖 PODBAY",
    regex: "\\open(.){1,35}pod.bay.doors\\b",
    async execute(message) {
        if (message.content.match(
            /(\bOPie(?:,| ,)|,(?: )?OPie(?:$|[!"#$%&()*+,:;<=>?@^_{|}~\.])|<@1041050338775539732>|<@&1045554081848103007>|<@&1046068702396825674>|<@&1045554081848103007>)/gmi
        )) { return; }
        const imageDelay = 1800;
        const lastImage = message.client.timers.get("image-podbay") ?? imageDelay + 100;
        const elapsed = Math.trunc((message.createdTimestamp - lastImage) / 1000);
        if (elapsed > imageDelay) {
            message.client.timers.set("image-podbay", message.createdTimestamp);
            message.reply({
                content: `I'm sorry ${message.member.displayName}, I'm afraid I can't do that`,
                tts: "true"
            })
                .catch(err => { console.error(`[ERROR] Relpying to message ${message.id} -`, err.message); });
        } else {
            if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
                message.react(`<:hal_9000:1140404991333498961>`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            } else {
                message.react(`🤖`)
                    .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
            }
        }
    }
}
