const { EmbedBuilder } = require('discord.js');
const kudosDb = require('./kudosDb');
kudosDb.init();

// List of emojis that count as upvotes, loaded from options.json
const options = require('../options.json');
const UPVOTE_EMOJIS = (options.modules && options.modules.kudos && Array.isArray(options.modules.kudos.upvoteEmojis))
  ? options.modules.kudos.upvoteEmojis
  : ["⭐"];

/**
 * Tally and store all upvote reactions for messages in a channel within a time window for a given episode.
 * @param {Client} client - Discord client
 * @param {string} channelId - Channel to process
 * @param {Date} startTime - Start of eligible window
 * @param {Date} endTime - End of eligible window
 * @param {string} episode - Episode name (e.g. S1E1, Finale)
 * @returns {Promise<number>} Number of reactions stored
 */
async function tallyAndStoreReactions(client, channelId, startTime, endTime, episode) {
  const channel = await client.channels.fetch(channelId);
  let allMessages = [];
  let lastId = undefined;
  let done = false;

  while (!done) {
    const options = { limit: 100 };
    if (lastId) options.before = lastId;
    const messages = await channel.messages.fetch(options);
    if (messages.size === 0) break;
    for (const msg of messages.values()) {
      if (msg.createdAt < startTime) {
        done = true;
        break;
      }
      if (msg.createdAt <= endTime) {
        allMessages.push(msg);
      }
    }
    lastId = messages.last().id;
  }

  let storedCount = 0;
  for (const msg of allMessages) {
    if (msg.author.bot) continue;
    for (const reaction of msg.reactions.cache.values()) {
      if (UPVOTE_EMOJIS.includes(reaction.emoji.name)) {
        const users = await reaction.users.fetch();
        for (const user of users.values()) {
          console.log(`User ${user.id} reacted with ${reaction.emoji.name} to message ${msg.id}`);
          if (user.id !== msg.author.id && !user.bot) {
            // Store reaction in DB
            kudosDb.addReaction(
              msg.id,
              user.id,
              msg.author.id,
              episode
            );
            storedCount++;
          }
        }
      }
    }
  }
  return storedCount;
}

/**
 * Get the leaderboard for the last N episodes (by name), excluding users in options.json leaderboardExclusions.
 * @param {string[]} episodes - Array of episode names (e.g. S1E1, Finale)
 * @param {number} limit - Number of places to show (ties included)
 * @returns {Array<{author_id: string, total_points: number}>}
 */
function getLeaderboard(episodes, limit = 10) {
  const exclusions = kudosDb.getLeaderboardBlacklist();
  return kudosDb.getLeaderboard(episodes, limit, exclusions);
}

module.exports = {
  tallyAndStoreReactions,
  getLeaderboard,
  UPVOTE_EMOJIS,
  deleteReactionsForEpisode: kudosDb.deleteReactionsForEpisode,
  getRecentEpisodes: kudosDb.getRecentEpisodes,
};