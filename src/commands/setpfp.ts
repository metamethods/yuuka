import { SlashCommandBuilder } from "discord.js";

import axios from "axios";

import Command from "@schemas/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("setpfp")
    .setDescription("Sets the bot's profile picture")
    .addStringOption(option => option.setName("url").setDescription("The url of the image").setRequired(true)),
  metadata: {
    disabled: true
  },
  handler: async ({ interaction, client }) => {
    const imageUrl = interaction.options.getString("url", true);
    const imageBuffer = await axios.get(imageUrl, { responseType: "arraybuffer" })
      .then(response => Buffer.from(response.data, "binary"));

    await client.user?.setAvatar(imageBuffer);
    await interaction.reply("Done!");
  }
})