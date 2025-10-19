const { Events } = require("discord.js");
const { postMessage } = require("../modules/featureHelper");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    try {
      const logDate = new Date().toLocaleString();
      console.log(`[${logDate}] 😐 JOIN  | ${member.guild.name} | ${member.user.tag}`);

      // Example: Post welcome message to a welcome channel using the helper
      const welcomeChannelId = "392093299890061312"; // Replace with your welcome channel ID
      const welcomeMessage = `🎉 Welcome to ${member.guild.name}, ${member.user}! Please read the rules and enjoy your stay!`;

      const sentMessage = await postMessage(
        member.client,
        welcomeChannelId,
        welcomeMessage
      );

      if (!sentMessage) {
        console.warn("Failed to send welcome message");
      }

    } catch (error) {
      console.error("Error in guildMemberAdd event:", error);
    }
  },
};