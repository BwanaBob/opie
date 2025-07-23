const { TwitterApi } = require("twitter-api-v2");
// const { stream } = require("undici");
require("dotenv").config();

// This module defines the twitter client, stream and search parameters
// Events are handled outide of this.

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

async function exportTweetStream() {
  try {
    // Get and delete old rules if needed
    const rules = await twitterClient.v2.streamRules();
    if (rules.data?.length) {
      // console.log(rules.data.map(rule => rule.id));
      // console.log(`Existing rules: ${rules.data?.length}`)
      await twitterClient.v2.updateStreamRules({
        delete: { ids: rules.data.map(rule => rule.id) },
      });
    }
    // const remainingRules = await twitterClient.v2.streamRules();
    // console.log(`Remaining rules: ${remainingRules.data?.length}`)

    // Add our rules
    await twitterClient.v2.updateStreamRules({
      add: [{
        value: 'OPLive from:danabrams -is:retweet -is:reply -is:quote has:images',
        tag: 'lineup'
      }, {
        value: "(Friday OR Saturday) Cable Originals from:ShowBuzzDaily lang:en -is:retweet -is:reply -is:quote",
        tag: 'ratings'
        // }, {
        //   value: "Cable Originals Friday from:ShowBuzzDaily lang:en -is:retweet -is:reply -is:quote",
        //   tag: 'ratings'
        // }, {
        //   value: "Cable Originals Saturday from:ShowBuzzDaily lang:en -is:retweet -is:reply -is:quote",
        //   tag: 'ratings'
        // }, {
        //   value: 'travel lang:en -is:retweet -is:reply -is:quote has:images',
        //   tag: 'travel'
        // }, {
        //   value: 'from:CNN lang:en -is:retweet -is:reply -is:quote',
        //   tag: 'cnn'
      }],
    });

    // const addedRules = await twitterClient.v2.streamRules();
    // console.log(`Added rules: ${addedRules.data?.length}`)

    const stream = await twitterClient.v2.searchStream({
      'tweet.fields': ['author_id', 'referenced_tweets'],
      expansions: ['author_id', 'attachments.media_keys'],
      'user.fields': ['username', 'id'],
      'media.fields': ['url', 'height', 'width', 'alt_text'],
    });
    // Enable auto reconnect
    stream.autoReconnect = true;
    // stream.keepAliveTimeoutMs = Infinity
    //stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));
    // console.log('Waiting for stream')

    if (!(stream === undefined)) {
      return stream;
    } else {
      console.log("⛔ [Error] Twitter Failed to connect!");
      return "Failed";
    }

  } catch (error) {
    console.error('⛔ [Error] ', error.data.detail);
    console.error('⛔ [Error] ', error.data);
  }
}

module.exports = exportTweetStream;