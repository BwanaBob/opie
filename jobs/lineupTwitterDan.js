const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const axios = require("axios");
const sharp = require("sharp");
const CronJob = require("cron").CronJob;
const RssWatcher = require("../modules/rss");
const options = require("../options.json");
const { schedule, scheduleTest, scheduleParked, feedURL, lineupRole } =
  options.jobs.lineupTwitterDan;

async function getImageBuffer(imageURL) {
  try {
    // Download the image
    const response = await axios.get(imageURL, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
  } catch (err) {
    console.error("Error fetching image buffer:", err.message);
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
    console.error("Error analyzing image:", err.message);
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
    console.error("Error processing image:", error.message);
  }
}

function getOriginalTwitterImageUrl(url) {
  if (url.includes("pbs.twimg.com/media/")) {
    if (url.includes("?")) {
      return url + "&name=orig";
    } else {
      return url + "?name=orig";
    }
  }
  return url;
}

module.exports = {
  execute(client) {
    const lineupChannel =
      client.channels.cache.get("1115429408614920303") ||
      client.channels.cache.get("1372986256757358745"); // OPL #announcements or OPie #jobs
    const jobLoadedDate = new Date().toLocaleString();
    console.log(
      `[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Lineup Twitter Dan`
    );
    var jobLineupTwitterDan = new CronJob(
      schedule,
      async () => {
        if (!module.exports._watcher) {
          module.exports._watcher = new RssWatcher({
            feedUrl: feedURL,
          });
        }
        const watcher = module.exports._watcher;
        try {
          console.log("📰 RSS  | Twitter Lineup | Checking");
          const newItems = await watcher.checkAndNotify();
          for (const item of newItems) {
            console.log(`📰 RSS | Twitter Lineup | Found  | ${item.link}`);
            let imageUrl = null;
            if (item.content && item.content.length > 0) {
              const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/);
              if (imgMatch && imgMatch[1]) {
                imageUrl = getOriginalTwitterImageUrl(imgMatch[1]);

                const thisImageBuffer = await getImageBuffer(imageUrl);
                if (!thisImageBuffer) {
                  console.log("Unable to retrieve image from post");
                  break;
                }
                const isLineupImage = await isImageRowWhite(thisImageBuffer, 0);
                // console.log("Is Lineup : ", isLineupImage);

                if (!isLineupImage) {
                  // postCache.add(post.post.uri); // Add to cache
                  break;
                }



                try {
                  const croppedImageBuffer = await removeWhiteBands(
                    thisImageBuffer
                  );
                  const discordAttachment = new AttachmentBuilder(
                    croppedImageBuffer,
                    { name: "cropped-lineup.jpg" }
                  );
                  await lineupChannel.send({
                    content: `<@&${lineupRole}>\n${item.title}`,
                    files: [discordAttachment],
                  });
                } catch (error) {
                  console.error("Error sending image:", error.message);
                  await notificationChannel.send(
                    "Failed to process and send the lineup image."
                  );
                  break;
                }
              }
            }
          }
          //   return { status: "success", data: newItems };
        } catch (err) {
          console.log("📰 RSS | Error", err.message);
        }

        const jobExecutedDate = new Date().toLocaleString();
        console.log(
          `[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Lineup Twitter Dan`
        );
      },
      null,
      true,
      "America/Chicago"
    );
  },
};
