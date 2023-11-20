import { SlashCommandBuilder } from "discord.js";

import Command from "@schemas/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Says hello"),
  handler: async ({ interaction, author }) => {
    await interaction.reply(`Hi <@${author.id}>`);
  }
})