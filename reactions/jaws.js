module.exports = {
  name: "Jaws",
  logName: "🦈 JAWS  ",
  regex: "jaws(?! of life)",
  async execute(message) {
    if (message.client.guilds.cache.get('325206992413130753')) { //bot is a member of OPL
      message.react(`<:jaws:1093958471394791617>`)
        .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
    } else {
      message.react(`🦈`)
        .catch(err => { console.error(`[ERROR] Reacting to message ${message.id} -`, err.message); });
    }
  }
}