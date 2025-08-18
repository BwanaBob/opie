/**
 * Sends a leaderboard as a plain text message with markdown and clickable mentions.
 * @param {TextChannel} channel - The Discord channel to send the message to.
 * @param {Array<{author_id: string, total_points: number}>} leaderboard - Leaderboard data from kudosDb.getLeaderboard.
 * @param {Object} [options] - Optional settings (e.g., title, description)
 */
const { EmbedBuilder } = require('discord.js');
async function sendKudosLeaderboardText(channel, leaderboard, options = {}) {
  const title = options.title || 'All-Star Leaderboard';
  const description = options.description || 'Top contributors for recent episodes!';

  // Fetch nicknames (aliases) for all unique author_ids, fallback to username
  const client = channel.client;
  const guild = channel.guild;
  const userIds = [...new Set(leaderboard.map(entry => entry.author_id))];
  const userMap = {};
  for (const id of userIds) {
    try {
      let displayName;
      if (guild) {
        const member = await guild.members.fetch(id);
        console.log(`Fetched member ${member.nickname} - ${member.user.username} (${id})`);
        displayName = member.nickname || member.user.username + (member.user.discriminator && member.user.discriminator !== '0' ? `#${member.user.discriminator}` : '');
      } else {
        const user = await client.users.fetch(id);
        displayName = user.username + (user.discriminator && user.discriminator !== '0' ? `#${user.discriminator}` : '');
      }
      userMap[id] = displayName;
    } catch (e) {
      userMap[id] = `UnknownUser(${id})`;
    }
  }

  let leaderboardText = '';
  if (!leaderboard.length) {
    leaderboardText = 'No data found for this period.';
  } else {
    let rank = 1;
    let prevPoints = null;
    let skip = 0;
    leaderboard.forEach((entry, i) => {
      if (prevPoints !== null) {
        if (entry.total_points === prevPoints) {
          skip++;
        } else {
          rank += skip + 1;
          skip = 0;
        }
      }
      const username = userMap[entry.author_id] || `UnknownUser(${entry.author_id})`;
      leaderboardText += `\n**#${rank}:** ${username} — **${entry.total_points} point${entry.total_points === 1 ? '' : 's'}**`;
      prevPoints = entry.total_points;
    });
  }

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .addFields({ name: 'Leaderboard', value: leaderboardText })
    .setColor(0x00bfff);

  await channel.send({
    embeds: [embed],
    allowedMentions: { users: [] }
  });
}

module.exports = {
  sendKudosLeaderboardText,
};
