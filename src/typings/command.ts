import type { SlashCommandBuilder, ChatInputCommandInteraction, User } from "discord.js";

import type Client from "@classes/Client";

export interface HandlerOptions {
  /**
   * The interaction of the command
   */
  interaction: ChatInputCommandInteraction;

  /**
   * The user who ran the command
   */
  author: User;

  /**
   * The bot client object
   */
  client: Client;
}

export type Metadata = Partial<{
  /**
   * How long the command be on cooldown for when a user runs that command
   */
  cooldown: number | undefined;

  /**
   * If the command be on cooldown for everyone when a user runs that command
   */
  globalCooldown: boolean;

  /**
   * Disables the command
   */
  disabled: boolean;
}>

export interface CommandOptions {
  /**
   * Configuration of the command
   */
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

  /**
   * Handler of the command when its ran by an user
   *
   * @param options All the options of the command
   * @returns {void}
   */
  handler: (options: HandlerOptions) => Promise<unknown>;

  /**
   * Metadata of the command
   */
  metadata?: Metadata;
}