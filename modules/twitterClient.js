const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

// This module defines the twitter client, stream and search parameters
// Events are handled outide of this.

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

async function exportTweetStream() {
  // Get and delete old rules if needed
  const rules = await twitterClient.v2.streamRules();
  if (rules.data?.length) {
    await twitterClient.v2.updateStreamRules({
      delete: { ids: rules.data.map(rule => rule.id) },
    });
  }

  // Add our rules
  await twitterClient.v2.updateStreamRules({
    add: [{
      value: '#OPLive from:danabrams lang:en has:images -is:retweet -is:reply -is:quote',
      tag: 'lineup'
    // }, {
    //   value: '#Fursuit lang:en -is:retweet -is:reply -is:quote has:images',
    //   tag: 'furry'
    }],
  });

  const stream = await twitterClient.v2.searchStream({
    'tweet.fields': ['author_id', 'referenced_tweets'],
    expansions: ['author_id', 'attachments.media_keys'],
    'user.fields': ['username', 'id'],
    'media.fields': ['url', 'height', 'width', 'alt_text'],
  });
  // Enable auto reconnect
  stream.autoReconnect = true;

  //stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));
  // console.log('Waiting for stream')

  return stream;
}

module.exports = exportTweetStream;