import { SlashCommandBuilder } from "discord.js";
import { Messages } from "@enums/messages";

import Command from "@schemas/Command";

import format from "@utility/format";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Says hello"),
  handler: async ({ interaction, author }) => {
    await interaction.reply(format(Messages.GREETING, { author: author.id }));

  }
})