/**
 * Feature: Post Message
 * 
 * Simple feature to post a message to a Discord channel.
 * Can be called from commands, events, or jobs.
 * 
 * @param {Object} params - Parameters object
 * @param {Client} params.client - Discord client instance
 * @param {string} params.channelId - ID of the channel to post to
 * @param {string} params.messageText - Text content of the message
 * @param {Object} [params.options] - Optional parameters
 * @param {boolean} [params.options.silent] - If true, suppress error logging (default: false)
 * @returns {Promise<Message|null>} - Returns the sent message or null if failed
 */
async function postMessage({ client, channelId, messageText, options = {} }) {
  try {
    // Validate inputs
    if (!client) {
      throw new Error('Discord client is required');
    }
    
    if (!channelId) {
      throw new Error('Channel ID is required');
    }
    
    if (!messageText || messageText.trim() === '') {
      throw new Error('Message text is required');
    }

    // Get the channel
    const channel = client.channels.cache.get(channelId);
    
    if (!channel) {
      throw new Error(`Channel with ID ${channelId} not found`);
    }

    // Check if the channel is a text-based channel
    if (!channel.isTextBased()) {
      throw new Error(`Channel ${channelId} is not a text-based channel`);
    }

    // Send the message
    const sentMessage = await channel.send({ content: messageText });
    
    // Log success (unless silent)
    if (!options.silent) {
      const timestamp = new Date().toLocaleString();
      console.log(`[${timestamp}] ✅ FEATURE | Message sent to #${channel.name} (${channelId})`);
    }
    
    return sentMessage;
    
  } catch (error) {
    // Log error (unless silent)
    if (!options.silent) {
      const timestamp = new Date().toLocaleString();
      console.error(`[${timestamp}] ❌ FEATURE | Failed to post message: ${error.message}`);
    }
    
    return null;
  }
}

module.exports = {
  name: 'postMessage',
  description: 'Posts a message to a Discord channel',
  execute: postMessage
};