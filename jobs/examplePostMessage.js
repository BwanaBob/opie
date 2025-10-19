const CronJob = require("cron").CronJob;

module.exports = {
  execute(client) {
    const jobLoadedDate = new Date().toLocaleString();
    console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Example Post Message`);

    // Example job that posts a message every hour (commented out for safety)
    // var exampleJob = new CronJob(
    //   '0 0 * * * *', // Every hour at minute 0
    //   async () => {
    //     try {
    //       const postMessageFeature = client.features.get("postMessage");
          
    //       if (postMessageFeature) {
    //         await postMessageFeature.execute({
    //           client: client,
    //           channelId: "392093299890061312", // Replace with your channel ID
    //           messageText: "Hourly automated message from the postMessage feature!",
    //           options: { silent: false }
    //         });
    //       }
    //     } catch (error) {
    //       console.error("Error in example post message job:", error);
    //     }
    //   },
    //   null,
    //   false, // Don't start automatically
    //   "America/New_York"
    // );

    // Uncomment the line below to start the job
    // exampleJob.start();
    
    console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Status    | Example Post Message - Ready (but not started)`);
  },
};