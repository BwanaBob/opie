// TODO:
// Once lineup has been posted, stop looking for the rest of the day (lastLineupFoundDate)

// const { EmbedBuilder, ActivityType, AttachmentBuilder } = require("discord.js");
require("dotenv").config();
const Bluesky = require("../modules/blueSky.js");
const CronJob = require("cron").CronJob;
const axios = require("axios");
const sharp = require("sharp");
const options = require("../options.json");
const { AttachmentBuilder } = require("discord.js");
const { schedule, scheduleTest, scheduleParked, readBehind } =
  options.jobs.blueskyLineup;
const username = process.env.BLUESKY_USER_TEST;
const password = process.env.BLUESKY_PASS_TEST;
const postCache = new Set(); // Cache for post URIs
const startTime = new Date() - readBehind * 1000; // When the job was first scheduled

async function getImageBuffer(imageURL) {
  try {
    // Download the image
    const response = await axios.get(imageURL, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
  } catch (err) {
    console.error("Error fetching image buffer:", err);
    return false;
  }
}

async function isImageRowWhite(
  imageBuffer,
  rowNumber,
  whiteThreshold = 240,
  percentageThreshold = 95
) {
  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    if (!width || !height) {
      throw new Error("Failed to retrieve image dimensions.");
    }

    // Extract the row
    const thisRow = await sharp(imageBuffer)
      .extract({ left: 0, top: rowNumber, width, height: 1 })
      .raw()
      .toBuffer();

    // Check if the row is mostly white
    const isRowWhite = rowIsWhite(
      thisRow,
      width,
      whiteThreshold,
      percentageThreshold
    );
    // console.log(`Row ${rowNumber} is ${isRowWhite}` )
    return isRowWhite;
  } catch (err) {
    console.error("Error analyzing image:", err);
    return false;
  }
}

function rowIsWhite(
  bandBuffer,
  totalPixels,
  whiteThreshold,
  percentageThreshold
) {
  let whitePixelCount = 0;

  for (let i = 0; i < bandBuffer.length; i += 3) {
    const [r, g, b] = [bandBuffer[i], bandBuffer[i + 1], bandBuffer[i + 2]];
    if (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) {
      whitePixelCount++;
    }
  }

  const whitePercentage = (whitePixelCount / totalPixels) * 100;
  return whitePercentage >= percentageThreshold;
}

async function removeWhiteBands(imageBuffer) {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;
    if (!width || !height) {
      throw new Error("Failed to retrieve image dimensions.");
    }

    // Detect white bands
    let topWhiteRows = 0;
    for (let row = 0; row < height; row++) {
      if (await isImageRowWhite(imageBuffer, row)) {
        topWhiteRows++;
      } else {
        break;
      }
    }

    let bottomWhiteRows = 0;
    for (let row = height - 1; row >= 0; row--) {
      if (await isImageRowWhite(imageBuffer, row)) {
        bottomWhiteRows++;
        // console.log(`Row ${row} is indeed true`)
      } else {
        break;
      }
    }

    // console.log(
    //   `Top white rows: ${topWhiteRows}, Bottom white rows: ${bottomWhiteRows}`
    // );

    // Crop the image to remove white bands
    const croppedHeight = height - topWhiteRows - bottomWhiteRows;
    const croppedBuffer = await sharp(imageBuffer)
      .extract({
        left: 0,
        top: topWhiteRows,
        width: width,
        height: croppedHeight,
      })
      .toBuffer();

    // console.log("White bands removed");
    return croppedBuffer;
  } catch (error) {
    console.error("Error processing image:", error);
  }
}

module.exports = {
  execute(client) {
    // let lineupChannel = client.channels.cache.get("392093299890061312"); // OPie #General
    const lineupChannel =
      client.channels.cache.get("1115429408614920303") ||
      client.channels.cache.get("392120898909634561"); // #Announcements or OPie #Bot-Test
    const notificationChannel =
      client.channels.cache.get("1043646191247826945") ||
      client.channels.cache.get("392120898909634561"); // OPL Notifications or OPie #Bot-Test
    let targetUsername = "ulladulla.bsky.social";
    let lineupRole = "1116032334303604746"; // OPie Role
    if (client.guilds.cache.get("325206992413130753")) {
      //bot is a member of OPL
      lineupRole = "1131662348617269479"; // OPL Role
      let targetUsername = "danabrams1.bsky.social";
    }
    const jobLoadedDate = new Date().toLocaleString();
    console.log(`[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | BlueSky Lineup`);
    var jobBlueskyLineup = new CronJob(
      scheduleParked,
      async () => {
        //   '*/15 * * * * *', async () => {
        // notificationChannel.send("Locating lineup");

        const bluesky = new Bluesky(username, password);

        // Fetch posts from the target user
        try {
          const { posts, nextCursor } = await bluesky.getPostsFromUser(
            targetUsername
          );

          if (posts.length > 0) {
            // console.log("Found posts:", posts.length);

            for (const post of posts) {
              if (postCache.has(post.post.uri)) {
                break;
              } else {
                // post has not been retrieved previously
                postCache.add(post.post.uri); // Add to cache
              }
              const indexedAt = new Date(post.post.indexedAt);
              if (indexedAt < startTime) {
                console.log("Posted before bot started, skipping.");
                break;
              }
              const now = new Date();
              const twelveHoursAgo = new Date(
                now.getTime() - 12 * 60 * 60 * 1000
              );
              if (indexedAt < twelveHoursAgo) {
                console.log("Post is older than 12 hours, skipping.");
                break;
              }

              for (const image of post.post.embed?.images) {
                const imageURL = image.fullsize;
                // console.log("New Image: ", imageURL);
                // lineupChannel.send(`New Image:\n${imageURL}`);
                const thisImageBuffer = await getImageBuffer(imageURL);
                // const thisImageBuffer = await getImageBuffer(
                //   "https://i.imgur.com/btjWhKE.jpeg"
                // );
                const isLineupImage = await isImageRowWhite(thisImageBuffer, 0);
                // console.log("Is Lineup : ", isLineupImage);

                if (!isLineupImage) {
                  break;
                }
                const lineupFoundDate = new Date().toLocaleString();
                console.log(`[${lineupFoundDate}] 📋 LINEUP| Lineup Found `);
                try {
                  const croppedImageBuffer = await removeWhiteBands(
                    thisImageBuffer
                  );
                  const discordAttachment = new AttachmentBuilder(
                    croppedImageBuffer,
                    { name: "cropped-lineup.jpg" }
                  );
                  await lineupChannel.send({
                    content: `Here is tonight's <@&${lineupTestRole}>!`,
                    files: [discordAttachment],
                  });
                } catch (error) {
                  console.error("Error sending image:", error);
                  await notificationChannel.send(
                    "Failed to process and send the lineup image."
                  );
                }
              }
            }

            // console.log("Next page cursor:", nextCursor);
          } else {
            // console.log("No posts found.");
          }
        } catch (error) {
          console.error("Error in Bluesky module:", error);
        }
        const jobExecutedDate = new Date().toLocaleString();
        console.log(
          `[${jobExecutedDate}] 📋 LINEUP| Job Executed  | BlueSky Lineup`
        );
      },
      null,
      true,
      "America/Chicago"
    );
  },
};
