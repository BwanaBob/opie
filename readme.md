# OPie

A node.js Discord bot that is currently used by the On Patrol: Live Discord server.

The initial impetus for the bot was the rampant overuse of GIFs and changing of usernames on the server.
Rather than preventing those things, the desire was to limit the frequency of those activities.

Currently the bot is developed on a homelab server and hosted on Akamai infrastructure.

Join the On Patrol Live Discord server at:<br>
https://discord.gg/jAA87dd9qv

or the sister Reddit sub:<br>
https://www.reddit.com/r/OnPatrolLive/

Discuss this bot on it's Discord server:<br>
https://discord.gg/z75ZZzEn6b

## Features
### Slash Commands
#### options
A moderator only command that controls OPie's behavior.
Delay buttons adjust how long users must wait between posting attachments (gifs)
Toggle buttons enable and disable: Emoji Reactions, Chatbot Chat, Announcements, twitter monitoring
#### post
A moderator only command that istruct OPie to post a preconfigured message in the current channel.
#### status
A moderator only command that allows changing of the bot's user status in discord.
#### echo
A moderator only command that has opie repeat whatever text you enter into the current channel.

#### bingo
Responds with info on where to play bingo
#### reddit
Responds with a link to our subreddit
#### rules
Responds with a link to the #rules channel
#### server
Responds with information about the current discord server

### Attachments Throttling
### Reactions
### ChatGPT chat
### Jobs
### Milestones
### Twitter Monitoring
This has recently been revisited using an rss feed rather than the rediculous twitter api.
The use of sharp for image processing means that the code should not be accessed via samba. use the locally pulled copy.
### Notices
#### User Name Change
#### Message Deleted
