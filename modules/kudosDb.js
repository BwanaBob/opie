// Get the N most recent (alphabetically greatest) episode names
const getRecentEpisodes = (count = 1) => {
  const rows = db.prepare(`SELECT DISTINCT episode FROM kudos_reactions ORDER BY episode DESC LIMIT ?`).all(count);
  return rows.map(r => r.episode);
};
// Delete all reactions for a given episode
const deleteReactionsForEpisode = (episode) => {
  const info = db.prepare(`DELETE FROM kudos_reactions WHERE episode = ?`).run(episode);
  return info.changes;
};


// kudosDb.js (flat schema, robust)
// Handles all database operations for the Kudos rolling leaderboard system using better-sqlite3

const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '../data/kudos-leaderboard.db'));

const init = () => {
  db.prepare(`CREATE TABLE IF NOT EXISTS kudos_reactions (
    message_id TEXT NOT NULL,
    voter_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    episode TEXT NOT NULL,
    PRIMARY KEY (message_id, voter_id)
  )`).run();
};

// Add a reaction for a message
const addReaction = (messageId, voterId, authorId, episode) => {
  db.prepare(`INSERT OR IGNORE INTO kudos_reactions (message_id, voter_id, author_id, episode) VALUES (?, ?, ?, ?)`)
    .run(messageId, voterId, authorId, episode);
};

// Remove a reaction (if needed)
const removeReaction = (messageId, voterId) => {
  db.prepare(`DELETE FROM kudos_reactions WHERE message_id = ? AND voter_id = ?`)
    .run(messageId, voterId);
};

// Get all voters for a message
const getVotersForMessage = (messageId) => {
  return db.prepare(`SELECT voter_id FROM kudos_reactions WHERE message_id = ?`).all(messageId);
};

// Get all reactions by a user (for abuse detection)
const getReactionsByUser = (voterId) => {
  return db.prepare(`SELECT message_id FROM kudos_reactions WHERE voter_id = ?`).all(voterId);
};

// Helper: ensure episodes is a non-empty array
function ensureEpisodes(episodes) {
  if (!Array.isArray(episodes) || episodes.length === 0) {
    throw new Error('episodes must be a non-empty array');
  }
  return episodes;
}

// Get the leaderboard for the last N episodes (top N), including all ties at the cutoff
const getLeaderboard = (episodes, limit = 10, exclusions = []) => {
  episodes = ensureEpisodes(episodes);
  const episodePlaceholders = episodes.map(() => '?').join(',');
  let exclusionClause = '';
  let params = [...episodes];
  if (exclusions && exclusions.length > 0) {
    exclusionClause = `AND author_id NOT IN (${exclusions.map(() => '?').join(',')})`;
    params = [...episodes, ...exclusions];
  }
  params.push(limit);
  const sql = `
    WITH user_message_votes AS (
      SELECT author_id, message_id, episode, COUNT(*) as votes
      FROM kudos_reactions
      WHERE episode IN (${episodePlaceholders}) ${exclusionClause}
      GROUP BY author_id, message_id, episode
    ),
    user_top_message AS (
      SELECT author_id, episode, message_id, votes
      FROM user_message_votes umv1
      WHERE votes = (
        SELECT MAX(votes) FROM user_message_votes umv2
        WHERE umv2.author_id = umv1.author_id AND umv2.episode = umv1.episode
      )
      AND message_id = (
        SELECT MIN(message_id) FROM user_message_votes umv3
        WHERE umv3.author_id = umv1.author_id AND umv3.episode = umv1.episode AND umv3.votes = umv1.votes
      )
    ),
    leaderboard AS (
      SELECT author_id, SUM(votes) as total_points
      FROM user_top_message
      GROUP BY author_id
      ORDER BY total_points DESC
    )
    SELECT * FROM leaderboard
    WHERE total_points >= (
      SELECT MIN(total_points) FROM (
        SELECT total_points FROM leaderboard ORDER BY total_points DESC LIMIT ?
      )
    )
    ORDER BY total_points DESC
  `;
  return db.prepare(sql).all(...params);
};

// Get a user's rank for the last N episodes
const getUserRank = (userId, episodes) => {
  episodes = ensureEpisodes(episodes);
  const leaderboard = getLeaderboard(episodes, 10000); // get all
  const rank = leaderboard.findIndex(row => row.author_id === userId);
  return rank === -1 ? null : rank + 1;
};

// Get all reactions for a user (for debugging)
const getUserHistory = (userId) => {
  return db.prepare(`SELECT * FROM kudos_reactions WHERE author_id = ? ORDER BY episode DESC`).all(userId);
};

// Get total points for a user over the last N episodes (sum of their top message per episode)
const getTotalPointsForUser = (userId, episodes) => {
  episodes = ensureEpisodes(episodes);
  const leaderboard = getLeaderboard(episodes, 10000);
  const user = leaderboard.find(row => row.author_id === userId);
  return user ? user.total_points : 0;
};

module.exports = {
  init,
  addReaction,
  removeReaction,
  getVotersForMessage,
  getReactionsByUser,
  getLeaderboard,
  getUserRank,
  getUserHistory,
  getTotalPointsForUser,
  deleteReactionsForEpisode,
  getRecentEpisodes,
  db
};
