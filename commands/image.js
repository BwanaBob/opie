const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
    ),
  async execute(interaction) {
    const input =
      interaction.options.getString("prompt") ??
      "An angry robot cat showing you his tail agressively.";
    // await interaction.reply({ content: "Generating Image", ephemeral: true });
    //   await interaction.channel.send({ content: input });
    await interaction.channel.sendTyping();
    await interaction.deferReply(); // Defer the reply
    try {
      const response = await openai.createImage({
        // model: 'gpt-4o-mini',
        prompt: input,
        n: 1,
        size: "1024x1024",
        model: "dall-e-3",
      });

      const imageUrl = response.data.data[0].url;
      //   await interaction.reply({ content: imageUrl, ephemeral: true });

      const embed = new EmbedBuilder()
        // .setTitle("Generated Image")
        // .setDescription(input)
        .setImage(imageUrl)
        .setColor("#151321")
        .setFooter({ text: input });

      await interaction.editReply({ embeds: [embed] });

      // await interaction.editReply({ content: `**Generating Image**\n${input}\n${imageUrl}`, ephemeral: false });
      // message.channel.send(imageUrl);
    } catch (error) {
      console.error(error);
      interaction.channel.send("Failed to generate image.");
    }
  },
};
