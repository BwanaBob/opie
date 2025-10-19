/**
 * Feature Helper Utilities
 * 
 * Provides convenient helper functions for accessing and using features
 * from anywhere in the application (commands, events, jobs, etc.)
 */

/**
 * Get a feature by name
 * @param {Client} client - Discord client instance
 * @param {string} featureName - Name of the feature to retrieve
 * @returns {Object|null} - Feature object or null if not found
 */
function getFeature(client, featureName) {
  if (!client || !client.features) {
    console.error("Client or features collection not available");
    return null;
  }
  
  return client.features.get(featureName) || null;
}

/**
 * Execute a feature with error handling
 * @param {Client} client - Discord client instance
 * @param {string} featureName - Name of the feature to execute
 * @param {Object} params - Parameters to pass to the feature
 * @returns {Promise<*>} - Result of the feature execution or null if failed
 */
async function executeFeature(client, featureName, params = {}) {
  try {
    const feature = getFeature(client, featureName);
    
    if (!feature) {
      console.error(`Feature '${featureName}' not found`);
      return null;
    }
    
    if (typeof feature.execute !== 'function') {
      console.error(`Feature '${featureName}' does not have an execute function`);
      return null;
    }
    
    return await feature.execute(params);
    
  } catch (error) {
    console.error(`Error executing feature '${featureName}':`, error);
    return null;
  }
}

/**
 * Post a message using the postMessage feature (convenience function)
 * @param {Client} client - Discord client instance
 * @param {string} channelId - Channel ID to post to
 * @param {string} messageText - Message text to post
 * @param {Object} options - Optional parameters
 * @returns {Promise<Message|null>} - Sent message or null if failed
 */
async function postMessage(client, channelId, messageText, options = {}) {
  return await executeFeature(client, 'postMessage', {
    client,
    channelId,
    messageText,
    options
  });
}

/**
 * List all available features
 * @param {Client} client - Discord client instance
 * @returns {Array<string>} - Array of feature names
 */
function listFeatures(client) {
  if (!client || !client.features) {
    return [];
  }
  
  return Array.from(client.features.keys());
}

/**
 * Check if a feature is available
 * @param {Client} client - Discord client instance
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} - True if feature is available
 */
function hasFeature(client, featureName) {
  return getFeature(client, featureName) !== null;
}

module.exports = {
  getFeature,
  executeFeature,
  postMessage,
  listFeatures,
  hasFeature
};