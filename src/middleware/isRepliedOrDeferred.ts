import type { ChatInputCommandInteraction } from "discord.js";

/**
 * Checks if an interaction already has already replied/deferred
 * @param interaction The interaction of the command
 */
export function isRepliedOrDeferred(interaction: ChatInputCommandInteraction): boolean {
  return interaction.replied || interaction.deferred;
}