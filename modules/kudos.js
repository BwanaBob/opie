const { EmbedBuilder } = require('discord.js');

// List of emojis that count as upvotes
const UPVOTE_EMOJIS = ['👍', '❤️', '😂', '🔥', '👏', '😀','😃','😄','😁','😁','😀','😃','😄','😆','🥹','😅','😂','🤣','🙂','😍','🥰','😋','😎','😺','😸','😹','😻','🤟','🤘','⬆️','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','❣️','💕','❤️‍🔥','100_bright', '200_iq', 'arcticfoxlaughing', 'black_heart_beating', 'blue_heart_beating', 'brown_heart_beating', 'green_heart_beating', 'grey_heart_beating', 'light_blue_heart_beating', 'orange_heart_beating', 'pink_heart_beating', 'purple_heart_beating', 'rainbow_heart', 'red_heart_beating', 'two_hearts_twist', 'two_hearts_beating', 'teal_heart', 'teal_heart_beating', 'thin_blue_line_heart', 'pink_heart', 'white_heart_beating', 'yellow_heart_beating', 'cowheart', 'thank_you', 'this', 'metal_horns', 'cat_heart_eyes', 'ferret_heart_eyes', 'fire_heart', 'smiling_heart_eyes', 'smiling_hearts', 'fire_animated', 'dabbydabbysticksdabby', 'cat_jump', 'drooling', 'grinning_cat', 'hyper', 'melting_face_animated', 'rolling_laughing', 'sausage_thumbs_up', 'sloth_dance', 'thumbs_up', 'yum_animated']; // Add/remove as needed

/**
 * Tallies upvotes for messages in a channel within a time window.
 * @param {Client} client - Discord client
 * @param {string} channelId - Channel to process
 * @param {Date} startTime - Start of eligible window
 * @param {Date} endTime - End of eligible window
 * @param {string} moderatorChannelId - Channel to send results
 */
async function tallyKudos(client, channelId, startTime, endTime, moderatorChannelId) {
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

  // Tally upvotes
  const results = [];
  for (const msg of allMessages) {
    // Skip bot messages
    if (msg.author.bot) continue;
    let upvoteCount = 0;
    const uniqueUsers = new Set();

    for (const reaction of msg.reactions.cache.values()) {
      // console.log(`Checking reaction: ${reaction.emoji.name} on message ${msg.id}`);
      if (UPVOTE_EMOJIS.includes(reaction.emoji.name)) {
        for (const user of await reaction.users.fetch()) {
          if (user.id !== msg.author.id) { // Don't count self-votes
            uniqueUsers.add(user.id);
          }
        }
      }
    }
    upvoteCount = uniqueUsers.size;
    if (upvoteCount > 0) {
      results.push({
        message: msg,
        author: msg.author,
        upvotes: upvoteCount,
      });
    }
  }

  // Sort and allow ties
  results.sort((a, b) => b.upvotes - a.upvotes);
  const topUpvotes = results.length > 0 ? results[0].upvotes : 0;
  const topResults = results.filter(r => r.upvotes === topUpvotes);

  // Prepare embed for moderator channel
  const embed = new EmbedBuilder()
    .setTitle('Kudos Award Results')
    .setDescription(
      `Top comments by upvotes:\n\n` +
      `Eligible window: <t:${Math.floor(startTime.getTime()/1000)}:f> to <t:${Math.floor(endTime.getTime()/1000)}:f>`
    )
    .setColor('#FFD700');

  embed.addFields(
    topResults.slice(0, 20).map((result, idx) => ({
      name: `#${idx + 1} - ${result.message.member?.nickname || result.author.username}`,
      value: `Upvotes: ${result.upvotes}\n[Jump to Message](${result.message.url})`
    }))
  );

  if (topResults.length > 20) {
    embed.addFields({
      name: 'Note',
      value: `Only the first 20 tied winners are shown.`
    });
  }

  // Send to moderator channel
  const modChannel = await client.channels.fetch(moderatorChannelId);
  await modChannel.send({ embeds: [embed] });

  // Return results for further processing (e.g., adding buttons)
  return topResults;
}

module.exports = {
  tallyKudos,
  UPVOTE_EMOJIS,
};