module.exports = {
    name: "Easter",
    logName: "🐰 EASTER",
    regex: "(happy).(easter)",
    async execute(message) {
        message.react('🐰')
            .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
    }
}