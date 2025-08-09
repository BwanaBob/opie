/**
 * Sends a leaderboard as a plain text message with markdown and clickable mentions.
 * @param {TextChannel} channel - The Discord channel to send the message to.
 * @param {Array<{author_id: string, total_points: number}>} leaderboard - Leaderboard data from kudosDb.getLeaderboard.
 * @param {Object} [options] - Optional settings (e.g., title, description)
 */
async function sendKudosLeaderboardText(channel, leaderboard, options = {}) {
  const title = options.title || '**Kudos Leaderboard**';
  const description = options.description || '_Top contributors for recent episodes!_';

  let content = `${title}\n${description}\n`;

  if (!leaderboard.length) {
    content += '\n_No kudos data found for this period._';
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
      content += `\n**#${rank}:** <@${entry.author_id}> — **${entry.total_points} point${entry.total_points === 1 ? '' : 's'}**`;
      prevPoints = entry.total_points;
    });
  }

  await channel.send({
    content,
    allowedMentions: { parse: ['users'] }
  });
}

module.exports = {
  sendKudosLeaderboardText,
};
