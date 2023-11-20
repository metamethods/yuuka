import type { ChatInputCommandInteraction } from "discord.js";

/**
 * Checks if the interaction is valid
 * @param interaction The interaction of the command
 */
export function checkInteraction(interaction: ChatInputCommandInteraction): boolean {
  const createdTimestamp = interaction.createdTimestamp;
  const currentTimestamp = Date.now();

  const difference = currentTimestamp - createdTimestamp;

  return difference < 3000;
}