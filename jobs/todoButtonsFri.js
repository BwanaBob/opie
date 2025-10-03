const CronJob = require("cron").CronJob;
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { todoFriCron, todoTestCron } = require("../options.json");

module.exports = {
  execute(client) {
    const noticeChannel =
      client.channels.cache.get("1250585288942817381") ||
      client.channels.cache.get("1045327770592497694"); // OPL #mod-business or OPie #notifications
    const jobLoadedDate = new Date().toLocaleString();
    console.log(
      `[${jobLoadedDate}] ⌛ CRON  | Job Loaded    | Todo Buttons Fri`
    );
    
    var todoButtonsFridayJob = new CronJob(
      todoFriCron,
      async () => {
        let noticeRole = "391837678967980035"; // OPie Test Role
        let reacts = ["🧵","🤖","📆","🏅","📋","💬","⏺️","🔗","🚨","🧹",];
        const scheduleTime = Math.floor(new Date().setHours(17, 58, 0) / 1000);
        
        if (client.params.get("chatGPTAnnouncementsEnabled") == "true") {
          if (client.guilds.cache.get("325206992413130753")) {
            //bot is a member of OPL
            noticeRole = "325210261722234881"; // OPL Admin
          }

          // Define todo items with their initial state (🟩 = not complete, ✅ = complete)
          const todoItems = [
            `🟩 - 🧵 [Thread](<https://www.reddit.com/r/OnPatrolLive/about/wiki/moderation/live-thread/>) scheduled at <t:${scheduleTime}:t> <t:${scheduleTime}:R>`,
            `🟩 - 🤖 [Bot prompts](<https://github.com/BwanaBob/opie/commits/main/>)`,
            `🟩 - 📆 [Sidebar Schedule](<https://www.reelz.com/schedule/>)`,
            `🟩 - 🏅 Last Week's Comment of the Night Awards`,
            `🟩 - 📋 [Lineup](<https://twitter.com/danabrams>)`,
            `🟩 - 💬 Opening comment`,
            `🟩 - ⏺️ [First Shift Recording](<https://www.reelznow.com/live>)`,
            `🟩 - 🔗 First Shift Summary Link in Opener`,
            `🟩 - 🚨 Set Community Status & Highlights`,
            `🟩 - 🧹 Closing and !tidy`
          ];

          let noticeContent =
            `<@&${noticeRole}>\n## 📋 Friday Checklist\n### Pre-show\n` +
            todoItems.slice(0, 9).join('\n') +
            `\n### After\n` +
            todoItems.slice(9).join('\n') +
            `\n`;

          // Create buttons for each todo item
          const buttons1 = new ActionRowBuilder();
          const buttons2 = new ActionRowBuilder();
          
          // First row - items 0-4
          for (let i = 0; i < 5; i++) {
            buttons1.addComponents(
              new ButtonBuilder()
                .setCustomId(`todo_fri_${i}`)
                // .setLabel(`${i + 1}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(reacts[i])
            );
          }
          
          // Second row - items 5-9
          for (let i = 5; i < 10; i++) {
            buttons2.addComponents(
              new ButtonBuilder()
                .setCustomId(`todo_fri_${i}`)
                // .setLabel(`${i + 1}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(reacts[i])
            );
          }

          // Unpin previous reminder messages before posting the new one
          try {
            const pinnedMessages = await noticeChannel.messages.fetchPins();
            
            if (pinnedMessages.items && Array.isArray(pinnedMessages.items)) {
              const previousReminders = pinnedMessages.items
                .map(item => item.message)
                .filter(msg => msg && msg.content && (
                  msg.content.includes("## 📋 Friday Checklist") ||
                  msg.content.includes("## 📋 Saturday Checklist")
                ));
              
              for (const msg of previousReminders) {
                const messageObj = noticeChannel.messages.cache.get(msg.id);
                if (messageObj) {
                  await messageObj.unpin().catch((err) =>
                    console.error(`[ERROR] Unpinning message: `, err.message)
                  );
                }
              }
            }
          } catch (err) {
            console.error(`[ERROR] Fetching pinned messages: `, err.message);
          }

          const noticeMessage = await noticeChannel
            .send({ 
              content: noticeContent,
              components: [buttons1, buttons2]
            })
            .catch((err) => {
              console.error(`[ERROR] Sending message: `, err.message);
            });
            
          if (noticeMessage) {
            await noticeMessage.pin().catch((err) => {
              console.error(`[ERROR] Pinning message: `, err.message);
            });
          }
          
          const jobExecutedDate = new Date().toLocaleString();
          console.log(
            `[${jobExecutedDate}] ⌛ CRON  | Job Executed  | Todo Buttons Fri`
          );
        }
      },
      null,
      true,
      "America/Chicago"
    );
  },
};