const { TwitterApi, ETwitterStreamEvent } = require("twitter-api-v2");
require("dotenv").config();

// const client = new TwitterApi({
//   appKey: process.env.TWITTER_CONSUMER_API_KEY,
//   appSecret: process.env.TWITTER_CONSUMER_API_SECRET,
//   accessToken: process.env.TWITTER_ACCESS_TOKEN,
//   accessSecret: process.env.TWITTER_ACCESS_SECRET,
// });

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

async function setupStream() {
    // Get and delete old rules if needed
    console.log('Checking for rules')
    const rules = await twitterClient.v2.streamRules();
    if (rules.data?.length) {
        console.log('Deleting rules')
        await twitterClient.v2.updateStreamRules({
            delete: { ids: rules.data.map(rule => rule.id) },
        });
    }

    // Add our rules
    console.log('Adding rules')
    await twitterClient.v2.updateStreamRules({
        add: [{
            value: '#OPLive from:danabrams lang:en has:images -is:retweet -is:reply -is:quote',
            tag: 'lineup'
        }, {
            value: '#Fursuit lang:en -is:retweet -is:reply -is:quote has:images',
            tag: 'furry'
        // },{
        //     value: '#Furry lang:en -is:retweet -is:reply -is:quote has:images',
        //     tag: 'furry'
        }],
    });

    const stream = await twitterClient.v2.searchStream({
        'tweet.fields': ['author_id','referenced_tweets'],
        expansions: ['author_id','attachments.media_keys'],
        'user.fields': ['username','id'],
        'media.fields': ['url','height','width','alt_text'],
    });
    // Enable auto reconnect
    stream.autoReconnect = true;

    //stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));
    console.log('Waiting for stream')

    stream.on(ETwitterStreamEvent.Data, async tweet => {
        // console.log('|== DATA ==========================================================');
        // console.log(tweet.data);
        // console.log('|== INCLUDES ======================================================');
        // console.log(tweet.includes);
        // console.log('|== MEDIA =========================================================');
        // console.log(tweet.includes.media[0]);
        // console.log('|== RULES =========================================================');
        // console.log(tweet.matching_rules);
        // console.log('===================================================================');
        console.log(`URL: https://twitter.com/${tweet.includes.users[0].username}/status/${tweet.data.id}`)
    });

}

// const asda = deleteRules();
// const asdb = addRules();
// const asdd = setRules();
// setRules().catch((error) => {
//     console.error('Error setting up rules:', error);
// });
setupStream().catch((error) => {
    console.error('Error setting up filtered stream:', error);
});