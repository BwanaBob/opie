const { EmbedBuilder } = require('discord.js');

/**
 * Builds an embed for a user's top messages history.
 * @param {string} username - The Discord username or nickname.
 * @param {Array<{episode: string, votes: number, message_id: string, link?: string}>} historyRows - User's top messages.
 * @param {Object} [options] - Optional settings (e.g., title, description)
 * @returns {EmbedBuilder}
 */
function buildUserHistoryEmbed(username, historyRows, options = {}) {
  const title = options.title || `${username}'s All-Star History`;
  const description = options.description || `Your top messages for recent episodes!`;

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(0x00bfff);

  if (!historyRows.length) {
    embed.addFields({ name: 'Top Messages', value: 'No top messages found for this period.' });
  } else {
    for (const entry of historyRows) {
      let value = `**${entry.episode}** — ${entry.votes} point${entry.votes === 1 ? '' : 's'}`;
      if (entry.link) value += ` ([link](${entry.link}))`;
      embed.addFields({ name: 'Message', value });
    }
  }
  return embed;
}

module.exports = {
  buildUserHistoryEmbed,
};
