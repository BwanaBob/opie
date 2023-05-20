const { TwitterApi, ETwitterStreamEvent, TweetStream, ETwitterApiError } = require("twitter-api-v2");
require("dotenv").config();

// console.log(process.env.TWITTER_CONSUMER_API_KEY)
// console.log(process.env.TWITTER_CONSUMER_API_SECRET)
// console.log(process.env.TWITTER_ACCESS_TOKEN)
// console.log(process.env.TWITTER_ACCESS_SECRET)

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_API_KEY,
  appSecret: process.env.TWITTER_CONSUMER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const bearer = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;
const ETwitterStreamEvent = client.ETwitterStreamEvent;

module.exports = { twitterClient, twitterBearer, ETwitterStreamEvent };