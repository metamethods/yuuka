import { SlashCommandBuilder } from "discord.js";

import Command from "@schemas/Command";
import EmbedBuilder from "@schemas/EmbedBuilder";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Sends a test embed"),
  handler: async ({ interaction }) => {
    await interaction.reply({
      embeds: EmbedBuilder.create("Test", "This is a test embed", "Random", true)
    });
  }
})