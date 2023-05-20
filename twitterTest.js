const { TwitterApi, ETwitterStreamEvent, TweetStream, ETwitterApiError } = require("twitter-api-v2");
require("dotenv").config();

// const client = new TwitterApi({
//   appKey: process.env.TWITTER_CONSUMER_API_KEY,
//   appSecret: process.env.TWITTER_CONSUMER_API_SECRET,
//   accessToken: process.env.TWITTER_ACCESS_TOKEN,
//   accessSecret: process.env.TWITTER_ACCESS_SECRET,
// });

const bearer = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

// Not needed to await this!
const stream = bearer.v2.sampleStream({ autoConnect: false });

// Assign yor event handlers
// Emitted on Tweet
stream.on(ETwitterStreamEvent.Data, console.log);
// Emitted only on initial connection success
stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));

async function setupFilteredStream() {
// Start stream!
await stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
}

setupFilteredStream().catch((error) => {
    console.error('Error setting up filtered stream:', error);
});