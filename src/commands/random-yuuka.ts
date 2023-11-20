import { SlashCommandBuilder } from "discord.js";
import { Messages } from "@enums/messages";

import Command from "@schemas/Command";
import EmbedBuilder from "@schemas/EmbedBuilder";
import Booru from "booru";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("yuuka")
    .setDescription("Gets a random image of Yuuka from danbooru"),
  handler: async ({ interaction }) => {
    await interaction.deferReply();

    const booru = Booru("danbooru");
    const images = await booru.search(["yuuka_(blue_archive) "], { limit: 1, random: true });

    if (images.length === 0) 
      return interaction.editReply(Messages.BOORU_IMAGE_NOT_FOUND);

    const image = images[0];

    if (image.rating === "e")
      return interaction.editReply(Messages.BOORU_IMAGE_EXPLICIT);

    console.log(image);

    const embed = EmbedBuilder.create("Here you go", Messages.BOORU_IMAGE_SENT, "Orange")
      .setImage(image.fileUrl)
      .setURL(image.postView);

    await interaction.editReply({
      embeds: [embed]
    });
  }
})