const { EmbedBuilder } = require('discord.js');

// List of emojis that count as upvotes
const UPVOTE_EMOJIS = ['👍', '🔥', '👏', '😀','😃','😄','😁','😁','😀','😃','😄','😆','🥹','😅','😂','🤣','🙂','😍','🥰','😋','😎','😺','😸','😹','😻','🤟','🤘','⬆️','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','❣️','💕','❤️‍🔥','100_bright', '200_iq', 'arcticfoxlaughing', 'black_heart_beating', 'blue_heart_beating', 'brown_heart_beating', 'green_heart_beating', 'grey_heart_beating', 'light_blue_heart_beating', 'orange_heart_beating', 'pink_heart_beating', 'purple_heart_beating', 'rainbow_heart', 'red_heart_beating', 'two_hearts_twist', 'two_hearts_beating', 'teal_heart', 'teal_heart_beating', 'thin_blue_line_heart', 'pink_heart', 'white_heart_beating', 'yellow_heart_beating', 'cowheart', 'thank_you', 'this', 'metal_horns', 'cat_heart_eyes', 'ferret_heart_eyes', 'fire_heart', 'smiling_heart_eyes', 'smiling_hearts', 'fire_animated', 'dabbydabbysticksdabby', 'cat_jump', 'clapping_hands', 'drooling', 'grinning_cat', 'hyper', 'melting_face_animated', 'rolling_laughing', 'sausage_thumbs_up', 'sloth_dance', 'thumbs_up', 'yum_animated']; // Add/remove as needed

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
        const users = await reaction.users.fetch();
        for (const user of users.values()) {
          console.log(`Message ${msg.id} - User: ${user.id} (${user.username}) - Reaction: ${reaction.emoji.name}`);
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
  // Get top 3 unique upvote counts
  const uniqueUpvotes = [...new Set(results.map(r => r.upvotes))].slice(0, 3);
  // Get all messages with upvotes in the top 3 places (including ties)
  const topResults = results.filter(r => uniqueUpvotes.includes(r.upvotes));

  // Prepare embed for moderator channel
  const embed = new EmbedBuilder()
    .setTitle('Kudos Award Results')
    .setDescription(
      `Top comments by upvotes:\n\n` +
      `Eligible window: <t:${Math.floor(startTime.getTime()/1000)}:f> to <t:${Math.floor(endTime.getTime()/1000)}:f>`
    )
    .setColor('#FFD700');

  // Group messages by place
  let fields = [];
  uniqueUpvotes.forEach((upvotes, i) => {
    let placeLabel = '';
    if (i === 0) placeLabel = `1st place with ${upvotes} upvote${upvotes === 1 ? '' : 's'}:`;
    else if (i === 1) placeLabel = `2nd place with ${upvotes} upvote${upvotes === 1 ? '' : 's'}:`;
    else if (i === 2) placeLabel = `3rd place with ${upvotes} upvote${upvotes === 1 ? '' : 's'}:`;
    else placeLabel = `${i + 1}th place with ${upvotes} upvotes:`;

    const winners = topResults.filter(r => r.upvotes === upvotes);
    if (winners.length > 0) {
      // Build winner lines
      const winnerLines = winners.map(result =>
        `${result.message.member?.nickname || result.author.username} - [Jump to message](${result.message.url})`
      );
      // Chunk winner lines so each field value <= 1024 chars
      let chunk = [];
      let chunkLen = 0;
      let firstChunk = true;
      for (const line of winnerLines) {
        if (chunkLen + line.length + 1 > 1024) {
          fields.push({ name: firstChunk ? placeLabel : '\u200b', value: chunk.join('\n') });
          chunk = [];
          chunkLen = 0;
          firstChunk = false;
        }
        chunk.push(line);
        chunkLen += line.length + 1;
      }
      if (chunk.length > 0) {
        fields.push({ name: firstChunk ? placeLabel : '\u200b', value: chunk.join('\n') });
      }
    }
  });
  if (fields.length > 20) {
    fields = fields.slice(0, 20);
    fields.push({ name: 'Note', value: 'Only the first 20 places are shown.' });
  }
  embed.addFields(fields);

  if (topResults.length > 20) {
    embed.addFields({
      name: 'Note',
      value: `Only the first 20 winners are shown.`
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