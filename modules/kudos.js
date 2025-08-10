const { EmbedBuilder } = require('discord.js');
const kudosDb = require('./kudosDb');
kudosDb.init();

// List of emojis that count as upvotes
const UPVOTE_EMOJIS = [
  '⭐', '👍', '🔥', '👏', '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🙂', '😍', '🥰', '😋', '😎', '😺', '😸', '😹', '😻', '🤟', '🤘', '⬆️', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '❣️', '💕', '❤️‍🔥', '100_bright', '200_iq', 'arcticfoxlaughing', 'black_heart_beating', 'blue_heart_beating', 'brown_heart_beating', 'green_heart_beating', 'grey_heart_beating', 'light_blue_heart_beating', 'orange_heart_beating', 'pink_heart_beating', 'purple_heart_beating', 'rainbow_heart', 'red_heart_beating', 'two_hearts_twist', 'two_hearts_beating', 'teal_heart', 'teal_heart_beating', 'thin_blue_line_heart', 'pink_heart', 'white_heart_beating', 'yellow_heart_beating', 'cowheart', 'thank_you', 'this', 'metal_horns', 'cat_heart_eyes', 'ferret_heart_eyes', 'fire_heart', 'smiling_heart_eyes', 'smiling_hearts', 'fire_animated', 'dabbydabbysticksdabby', 'cat_jump', 'clapping_hands', 'drooling', 'grinning_cat', 'hyper', 'melting_face_animated', 'rolling_laughing', 'sausage_thumbs_up', 'sloth_dance', 'thumbs_up', 'yum_animated'
];

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
 
  const options = require('../options.json');
  const {leaderboardExclusions} = options.modules.kudos
  const exclusions = Array.isArray(leaderboardExclusions) ? leaderboardExclusions : [];
  return kudosDb.getLeaderboard(episodes, limit, exclusions);
}

/**
 * Get all voters for a message.
 * @param {string} messageId
 * @returns {Array<{voter_id: string}>}
 */
function getVotersForMessage(messageId) {
  return kudosDb.getVotersForMessage(messageId);
}

module.exports = {
  tallyAndStoreReactions,
  getLeaderboard,
  getVotersForMessage,
  UPVOTE_EMOJIS,
  deleteReactionsForEpisode: kudosDb.deleteReactionsForEpisode,
  getRecentEpisodes: kudosDb.getRecentEpisodes,
};