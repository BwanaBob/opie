

// kudosDb.js (flat schema, robust)
// Handles all database operations for the Kudos rolling leaderboard system using better-sqlite3

const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '../kudos-leaderboard.db'));

const init = () => {
  db.prepare(`CREATE TABLE IF NOT EXISTS kudos_reactions (
    message_id TEXT NOT NULL,
    voter_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    episode_date TEXT NOT NULL,
    PRIMARY KEY (message_id, voter_id)
  )`).run();
};

// Add a reaction for a message
const addReaction = (messageId, voterId, authorId, episodeDate) => {
  db.prepare(`INSERT OR IGNORE INTO kudos_reactions (message_id, voter_id, author_id, episode_date) VALUES (?, ?, ?, ?)`)
    .run(messageId, voterId, authorId, episodeDate);
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

// Helper: ensure episodeDates is a non-empty array
function ensureEpisodeDates(episodeDates) {
  if (!Array.isArray(episodeDates) || episodeDates.length === 0) {
    throw new Error('episodeDates must be a non-empty array');
  }
  return episodeDates;
}

// Get the leaderboard for the last N episodes (top N), including all ties at the cutoff
const getLeaderboard = (episodeDates, limit = 10) => {
  episodeDates = ensureEpisodeDates(episodeDates);
  const placeholders = episodeDates.map(() => '?').join(',');
  const sql = `
    WITH user_message_votes AS (
      SELECT author_id, message_id, episode_date, COUNT(*) as votes
      FROM kudos_reactions
      WHERE episode_date IN (${placeholders})
      GROUP BY author_id, message_id, episode_date
    ),
    user_top_message AS (
      SELECT author_id, episode_date, message_id, votes
      FROM user_message_votes umv1
      WHERE votes = (
        SELECT MAX(votes) FROM user_message_votes umv2
        WHERE umv2.author_id = umv1.author_id AND umv2.episode_date = umv1.episode_date
      )
      AND message_id = (
        SELECT MIN(message_id) FROM user_message_votes umv3
        WHERE umv3.author_id = umv1.author_id AND umv3.episode_date = umv1.episode_date AND umv3.votes = umv1.votes
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
  return db.prepare(sql).all(...episodeDates, limit);
};

// Get a user's rank for the last N episodes
const getUserRank = (userId, episodeDates) => {
  episodeDates = ensureEpisodeDates(episodeDates);
  const leaderboard = getLeaderboard(episodeDates, 10000); // get all
  const rank = leaderboard.findIndex(row => row.author_id === userId);
  return rank === -1 ? null : rank + 1;
};

// Get all reactions for a user (for debugging)
const getUserHistory = (userId) => {
  return db.prepare(`SELECT * FROM kudos_reactions WHERE author_id = ? ORDER BY episode_date DESC`).all(userId);
};

// Get total points for a user over the last N episodes (sum of their top message per episode)
const getTotalPointsForUser = (userId, episodeDates) => {
  episodeDates = ensureEpisodeDates(episodeDates);
  const leaderboard = getLeaderboard(episodeDates, 10000);
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
  db
};
