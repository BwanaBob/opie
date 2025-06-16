const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

require("dotenv").config();
const { OpenAI } = require("openai"); // Correct import
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY }); // Correct initialization

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("OPie generates an image for you.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Describe the image you want generated")
        .setRequired(true)
    ),
  async execute(interaction) {
    const input =
      interaction.options.getString("prompt") ?? 
      "An angry robot cat showing you his tail agressively.";
    await interaction.channel.sendTyping();
    await interaction.deferReply(); // Defer the reply
    try {
      const response = await openai.images.generate({ // Correct method
        prompt: input,
        n: 1,
        size: "1024x1024",
        model: "dall-e-3",
      });

      const imageUrl = response.data[0].url;

      const embed = new EmbedBuilder()
        .setImage(imageUrl)
        .setColor("#151321")
        .setFooter({ text: input });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.channel.send("Failed to generate image.");
    }
  },
};
