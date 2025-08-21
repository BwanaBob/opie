// Get a user's top messages for the last N episodes (single-query, faster)
const getUserTopMessages = (userId, episodeCount = 10) => {
  const episodes = getRecentEpisodes(episodeCount);
  if (!episodes.length) return [];

  const placeholders = episodes.map(() => '?').join(',');
  // Use a window function to pick the top message per episode (tie-breaker: smallest message_id)
  const sql = `
    SELECT episode, message_id, votes FROM (
      SELECT episode, message_id, COUNT(*) AS votes,
        ROW_NUMBER() OVER (PARTITION BY episode ORDER BY COUNT(*) DESC, message_id ASC) AS rn
      FROM kudos_reactions
      WHERE author_id = ? AND episode IN (${placeholders})
      GROUP BY episode, message_id
    ) WHERE rn = 1
  `;
  const rows = db.prepare(sql).all(userId, ...episodes);
  // Preserve ordering consistent with getRecentEpisodes (descending episode order)
  const map = new Map(rows.map(r => [r.episode, { episode: r.episode, message_id: r.message_id, votes: r.votes }]));
  return episodes.map(ep => map.get(ep)).filter(Boolean);
};

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
  // Helpful indexes for read-heavy queries
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_kudos_author_episode_msg ON kudos_reactions (author_id, episode, message_id)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_kudos_episode ON kudos_reactions (episode)`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS allstar_leaderboard_blacklist (
      user_id TEXT PRIMARY KEY,
      reason TEXT DEFAULT NULL,
      added_by TEXT DEFAULT NULL,
      added_at INTEGER DEFAULT (strftime('%s','now'))
    )`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS allstar_voter_blacklist (
      user_id TEXT PRIMARY KEY,
      reason TEXT DEFAULT NULL,
      added_by TEXT DEFAULT NULL,
      added_at INTEGER DEFAULT (strftime('%s','now'))
    )`).run();
};
// Leaderboard blacklist
const getLeaderboardBlacklist = () => {
  return db.prepare(`SELECT user_id FROM allstar_leaderboard_blacklist`).all().map(r => r.user_id);
};
const addLeaderboardBlacklist = (userId, reason = null, addedBy = null) => {
  const now = Math.floor(Date.now() / 1000);
  db.prepare(`INSERT OR REPLACE INTO allstar_leaderboard_blacklist (user_id, reason, added_by, added_at) VALUES (?, ?, ?, ?)`)
    .run(userId, reason, addedBy, now);
};
const removeLeaderboardBlacklist = (userId) => {
  db.prepare(`DELETE FROM allstar_leaderboard_blacklist WHERE user_id = ?`).run(userId);
};

// Voter blacklist
const getVoterBlacklist = () => {
  return db.prepare(`SELECT user_id FROM allstar_voter_blacklist`).all().map(r => r.user_id);
};
const addVoterBlacklist = (userId, reason = null, addedBy = null) => {
  const now = Math.floor(Date.now() / 1000);
  db.prepare(`INSERT OR REPLACE INTO allstar_voter_blacklist (user_id, reason, added_by, added_at) VALUES (?, ?, ?, ?)`)
    .run(userId, reason, addedBy, now);
};
const removeVoterBlacklist = (userId) => {
  db.prepare(`DELETE FROM allstar_voter_blacklist WHERE user_id = ?`).run(userId);
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
  // Get voter blacklist
  const voterBlacklist = getVoterBlacklist();
  let exclusionClause = '';
  let params = [...episodes];
  if (exclusions && exclusions.length > 0) {
    exclusionClause = `AND author_id NOT IN (${exclusions.map(() => '?').join(',')})`;
    params = [...episodes, ...exclusions];
  }
  // Add voter blacklist clause
  let voterClause = '';
  if (voterBlacklist.length > 0) {
    voterClause = `AND voter_id NOT IN (${voterBlacklist.map(() => '?').join(',')})`;
    params = [...params, ...voterBlacklist];
  }
  params.push(limit);
  const sql = `
    WITH user_message_votes AS (
      SELECT author_id, message_id, episode, COUNT(*) as votes
      FROM kudos_reactions
      WHERE episode IN (${episodePlaceholders}) ${exclusionClause} ${voterClause}
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


// Get all reactions for a user (for debugging)
const getUserHistory = (userId) => {
  return db.prepare(`SELECT * FROM kudos_reactions WHERE author_id = ? ORDER BY episode DESC`).all(userId);
};

module.exports = {
  init,
  addReaction,
  removeReaction,
  getReactionsByUser,
  getLeaderboard,
  getUserHistory,
  getUserTopMessages,
  deleteReactionsForEpisode,
  getRecentEpisodes,
  // Blacklist management
  getLeaderboardBlacklist,
  addLeaderboardBlacklist,
  removeLeaderboardBlacklist,
  getVoterBlacklist,
  addVoterBlacklist,
  removeVoterBlacklist,
  db
};
