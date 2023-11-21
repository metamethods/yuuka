import type { SlashCommandBuilder, ChatInputCommandInteraction, User, GuildMember } from "discord.js";

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
   * The user who ran the command in a guild
   */
  member?: GuildMember;

  /**
   * The bot client object
   */
  client: Client;

  /**
   * The channel where the command was ran
   */
  channel?: ChatInputCommandInteraction["channel"];
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
  data: Omit<SlashCommandBuilder, "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;

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