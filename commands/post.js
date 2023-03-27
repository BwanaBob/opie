const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const postReply = `Posted`;
const kidsEmbed = new EmbedBuilder()
.setColor(0xffce07)
.setTitle("Content Reminder")
.setDescription(
  "Please keep in mind, younger viewers join us."
)
.setThumbnail(
    "https://i.imgur.com/yunluXs.png"
);

const bingoEmbed = new EmbedBuilder()
.setColor(0xff0000)
.setTitle("Bingo")
.setDescription("Get your bingo cards and play with us live!")
.addFields({
  name: "Website",
  value: `[thatsabingo.com](https://www.thatsabingo.com/)`,
  inline: true,
})
.setURL('https://www.thatsabingo.com/')
.setThumbnail(
    "https://i.imgur.com/dJP9d8L.png"
);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Send an announcement to the current channel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to post')
        .setRequired(true)
        .addChoices(
          { name: 'kids', value: 'post_kids' },
          { name: 'bingo', value: 'post_bingo' },
        ))
      // .addChannelOption(option =>
      //   option.setName('channel')
      //     .setDescription('The channel to echo into')
      //     .setRequired(false))
      ,
    async execute(interaction) {
      const postMessage = interaction.options.getString('message') ?? 'post_none';
      let postEmbed = new EmbedBuilder();
      switch(postMessage){
        case "post_kids" : {
          postEmbed = kidsEmbed;
        }
        break;
        case "post_bingo" : {
          postEmbed = bingoEmbed;
        }
        break;
      }
      await interaction.reply({ content: postReply, ephemeral: true });
      interaction.channel.send({ embeds: [postEmbed] });
    },
};

