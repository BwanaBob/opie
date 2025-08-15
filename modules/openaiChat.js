const { PermissionsBitField } = require("discord.js");
require("dotenv").config();
const options = require("../options.json");
const {
  OpenAIChatModel,
  liveShows,
  userPrompts,
  moderatorPrompt,
  boosterPrompt,
} = options.modules.openaiChat;
const { OpenAI } = require("openai"); // v5 compatible import
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY }); // v5 compatible initialization
const { DateTime } = require("luxon"); // Import Luxon for timezone handling
const fs = require("fs");
const path = require("path");
const chroma = require("./chromaClient.js");

async function isMessageToOrFromBot(message, botId) {
  try {
    if (message.mentions.has(botId) || message.author.id === botId) {
      return true;
    }
    if (message.reference) {
      const repliedMessage = await message.fetchReference();
      return repliedMessage.author.id === botId;
    }
  } catch (error) {
    console.error("Error checking message reference:", error);
  }
  return false;
}

function sanitizeName(name) {
  // Remove invalid characters and replace spaces with underscores
  return name.replace(/[^\w-]/g, "_");
}

function formatMessageForLog(msg, botId, botName, asReply = false) {
  let thisMsgContent = [];

  // Add embed info if present
  if (msg.embeds && msg.embeds.length > 0) {
    msg.embeds.forEach((embed) => {
      if (embed.title) {
        thisMsgContent.push({
          type: "text",
          text: `[Embed Title]: ${embed.title}`,
        });
      }
      if (embed.description) {
        thisMsgContent.push({
          type: "text",
          text: `[Embed Description]: ${embed.description}`,
        });
      }
    });
  }

  // Add message content if present
  if (msg.content && msg.content.length > 0) {
    thisMsgContent.push({
      type: "text",
      text: msg.content.replaceAll(`<@${botId}>`, botName),
    });
  }

  // check for images in the message
  if (msg.attachments && msg.attachments.size > 0) {
    msg.attachments.forEach((attachment) => {
      if (
        attachment.contentType &&
        attachment.contentType.startsWith("image/")
      ) {
        thisMsgContent.push({
          type: "image_url",
          image_url: {
            url: attachment.url,
          },
        });
      }
    });
  }

  if (asReply) {
    // Prepend the reply context to the text content
    thisMsgContent.unshift({
      type: "text",
      text: `The user is replying to this message:`,
    });
  }

  return {
    role: msg.author.id === botId ? "assistant" : "user",
    name: sanitizeName(msg.member?.displayName || "Unknown"),
    content: thisMsgContent,
    messageId: msg.id, // <-- Add this line
  };
}

// Example post-processing function
function stripBotNameAndEmoji(text, botName) {
  // Regex: start of string, bot name, optional emoji, optional whitespace/newline
  const regex = new RegExp(
    `^${botName}\\s*(?:[\\p{Emoji_Presentation}\\p{Emoji}\\u200d]+)?\\s*`,
    "u"
  );
  return text.replace(regex, "");
}

module.exports = async function (message) {
  await message.channel.sendTyping();
  const botId = message.client.user.id;
  const botName = message.client.user.username; // Get the bot's name
  const botMessageHistory = [];
  const allMessageHistory = await message.channel.messages.fetch({ limit: 40 });
  for (const item of allMessageHistory) {
    const msg = item[1];
    if (await isMessageToOrFromBot(msg, botId)) {
      botMessageHistory.unshift(formatMessageForLog(msg, botId, botName));
    }
  }

  // Truncate conversationLog to avoid exceeding token limits
  const maxLogTokens = 4096 - 1024 - 300; // Reserve 1024 tokens for the response and 300 for the system prompts being added after this
  let totalTokens = 0;
  const filteredBotMessageHistory = [];
  for (const entry of botMessageHistory.reverse()) {
    const entryTokens = entry.content.length / 4; // Approximation: 1 token ≈ 4 characters
    if (totalTokens + entryTokens > maxLogTokens) break;
    filteredBotMessageHistory.unshift(entry);
    totalTokens += entryTokens;
  }

  // Log if truncation happened
  if (filteredBotMessageHistory.length < botMessageHistory.length) {
    console.log(
      `Truncation occurred: filtered length: ${filteredBotMessageHistory.length}, original lenght: ${botMessageHistory.length}`
    );
  }

  if (message.reference) {
    try {
      const referencedMessage = await message.fetchReference();
      if (referencedMessage) {
        // Remove the referenced message by messageId
        const refIndex = filteredBotMessageHistory.findIndex(
          (entry) => entry.messageId === referencedMessage.id
        );
        if (refIndex !== -1) {
          filteredBotMessageHistory.splice(refIndex, 1);
        }

        // Prepare the referenced message and combine the note with its first text content
        const replyEntry = formatMessageForLog(
          referencedMessage,
          botId,
          botName
        );
        const firstText = replyEntry.content.find((c) => c.type === "text");
        if (firstText) {
          firstText.text = `The user is replying to this message: ${firstText.text}`;
        } else {
          // If no text content, add the note as a new text block
          replyEntry.content.unshift({
            type: "text",
            text: `The user is replying to this message:`,
          });
        }

        // Insert as second-to-last (just before the user's message)
        if (filteredBotMessageHistory.length > 0) {
          filteredBotMessageHistory.splice(
            filteredBotMessageHistory.length - 1,
            0,
            replyEntry
          );
        } else {
          filteredBotMessageHistory.push(replyEntry);
        }
      }
    } catch (error) {
      console.error("Error fetching referenced message:", error);
    }
  }

  // Add user-specific prompts
  let thisUserPrompt = `You are speaking with a Discord user who goes by the handle ${message.member.displayName}.`;
  if (userPrompts[message.member.id]) {
    thisUserPrompt += ` ${userPrompts[message.member.id].prompt}`;
  } else if (
    message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    thisUserPrompt += ` ${moderatorPrompt}`;
  } else if (
    message.member.premiumSince &&
    !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
  ) {
    thisUserPrompt += ` ${boosterPrompt}`;
  }
  filteredBotMessageHistory.unshift({
    role: "system",
    content: thisUserPrompt,
  });

  // This should be handled by RAG now.
  // // Add prompts for context-specific information
  // if (message.content.toLowerCase().includes("first shift")) {
  //   // Convert to lowercase for case-insensitive match
  //   filteredBotMessageHistory.unshift({
  //     role: "system",
  //     content: `On Patrol First Shift is a program that airs for one hour prior to the start of On Patrol Live. The first 6 minutes of the show includes a live in-studio segment with the hosts and sometimes guests following up on events from recent episodes. The remaining 54 minutes of First Shift are just clips from previously aired episodes, and no live content.`,
  //   });
  // }

  try {
    const chromaResults = await chroma.queryOplChroma(message.content);
    if (chromaResults && chromaResults.length > 0) {
      for (let i = chromaResults.length - 1; i >= 0; i--) {
        const meta = chromaResults[i].metadata || {};
        let metaString = "";
        if (meta.episode || meta.date || meta.location) {
          metaString = ` (Episode: ${meta.episode || "N/A"}, Date: ${
            meta.date || "N/A"
          }, Location: ${meta.location || "N/A"})`;
        }
        filteredBotMessageHistory.unshift({
          role: "system",
          content: `Relevant knowledge (${i + 1}, score: ${chromaResults[i].score.toFixed(3)})${metaString}\n${
            chromaResults[i].text
          }`,
        });
      }
    }
  } catch (err) {
    console.error("Error querying Chroma for RAG:", err);
  }
  
  // This should also be handled by RAG now.
  // // Add prompts for live show information
  // if (liveShows.length > 0) {
  //   const upcomingShows = liveShows
  //     .map(
  //       (show) =>
  //         `${show.episode} on ${new Date(show.showtime).toLocaleString()} is ${show.type}.`
  //     ) // Format each showtime
  //     .join(", ");
  //   if (upcomingShows) {
  //     filteredBotMessageHistory.unshift({
  //       role: "system",
  //       content: `Upcoming and recent episodes: ${upcomingShows}`,
  //     });
  //   }
  // }

  // Get the current time in Eastern Time (EST)
  const currentTimeEST = DateTime.now()
    .setZone("America/New_York")
    .toLocaleString(DateTime.DATETIME_FULL);

  filteredBotMessageHistory.unshift({
    role: "system",
    content: `Today is ${currentTimeEST}.`, // Dynamically include the current date and time in EST
  });

  filteredBotMessageHistory.unshift({
    role: "system",
    content: `This conversation takes place on the Discord server for fans of the show "On Patrol Live" which airs on Fridays and Saturdays from 9 PM to 12 AM ET. You are familiar with the show's schedule, hosts, departments, and general format. If a question is about the show, answer with accurate and helpful information. If you're not sure about something, say you don't know. Do not make up information.`,
  });
  filteredBotMessageHistory.unshift({
    role: "system",
    content: `Respond like an affable, charismatic Discord chatbot kitten named OPie that exudes charm, wit, and friendliness. Do not preface your responses with your own name or emoji; Discord already shows your name and avatar. Keep text responses under 4050 characters.`,
  });

  // Write the prompt to a debug file before sending to OpenAI
  try {
    const debugDir = path.join(__dirname, "../debug");
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir);
    }
    const debugFile = path.join(debugDir, `openai_prompt_${Date.now()}.txt`);
    fs.writeFileSync(
      debugFile,
      JSON.stringify(filteredBotMessageHistory, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Error writing OpenAI prompt debug file:", err);
  }

  let apiPackage = {};
  // Remove messageId before sending to OpenAI
  const apiMessages = filteredBotMessageHistory.map(
    ({ messageId, ...rest }) => rest
  );

  // if mod or tech channel don't restrict response size
  if (
    message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) ||
    message.channel.id == "1250589626717175910" ||
    message.channel.id == "1119367030823473303" ||
    message.channel.id == "366531564693356554" ||
    message.channel.id == "1079220872973406319"
  ) {
    apiPackage = {
      model: OpenAIChatModel,
      // reasoning_effort: "medium",
      // verbosity: "low",
      messages: apiMessages,
      max_completion_tokens: 1024,
    };
  } else {
    apiPackage = {
      model: OpenAIChatModel,
      // reasoning_effort: "medium",
      // verbosity: "low",
      messages: apiMessages,
      max_completion_tokens: 512,
    };
  }

  // console.log(apiPackage);

  try {
    // v5: openai.chat.completions.create is still correct
    const result = await openai.chat.completions.create(apiPackage);
    // v5: response structure is still { choices: [{ message: { content } }] }
    // Write the response to a debug file after receiving from OpenAI
    try {
      const debugDir = path.join(__dirname, "../debug");
      if (!fs.existsSync(debugDir)) {
        fs.mkdirSync(debugDir);
      }
      const debugFile = path.join(
        debugDir,
        `openai_response_${Date.now()}.txt`
      );
      fs.writeFileSync(debugFile, JSON.stringify(result, null, 2), "utf8");
    } catch (err) {
      console.error("Error writing OpenAI response debug file:", err);
    }
    if (
      result &&
      result.choices &&
      result.choices[0] &&
      result.choices[0].message &&
      result.choices[0].message.content
    ) {
      const rawReply = result.choices[0].message.content;
      const cleanReply = stripBotNameAndEmoji(rawReply, botName);
      return cleanReply;
    } else {
      return "ERR";
    }
  } catch (error) {
    // v5: error structure may include .error property
    const errorDetails =
      error.error || error.response?.data || error.message || error.toString();
    console.error(`⛔ [Error] OPENAI:`, JSON.stringify(errorDetails, null, 2));
    return "ERR";
  }
};
