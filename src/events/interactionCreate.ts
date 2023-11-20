import { Events } from "discord.js";

import Event from "@schemas/Event";

import { command } from "@handlers/interaction";

export default new Event("on", Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.isCommand()) return command(interaction);
})