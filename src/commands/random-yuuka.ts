import { SlashCommandBuilder } from "discord.js";
import { Messages } from "@enums/messages";

import Command from "@schemas/Command";
import EmbedBuilder from "@schemas/EmbedBuilder";
import Booru from "booru";
import Log from "@schemas/Log";

import getTextChannel from "@utility/getTextChannel";

import { Level } from "@enums/level";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("yuuka")
    .setDescription("Gets a random image of Yuuka from danbooru"),
  handler: async ({ interaction, client }) => {
    await interaction.deferReply();

    const isNSFW = (await getTextChannel(client, interaction.channelId))?.nsfw ?? false;
    const booru = Booru(isNSFW ? "danbooru" : "safebooru");
    const images = await booru.search(["yuuka_(blue_archive)"], { limit: 1, random: true });

    Log.emit(`Channel is ${isNSFW ? "NSFW" : "SFW"}`, Level.Debug);

    if (images.length === 0) 
      return interaction.editReply(Messages.BOORU_IMAGE_NOT_FOUND);

    const image = images[0];

    const embed = EmbedBuilder.create("Here you go", Messages.BOORU_IMAGE_SENT, "Orange")
      .setImage(image.fileUrl)
      .setURL(image.postView);

    await interaction.editReply({
      embeds: [embed]
    });
  }
})