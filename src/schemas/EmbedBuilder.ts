import { EmbedBuilder as DiscordEmbedBuilder } from "discord.js";

import type { ColorResolvable } from "discord.js";

export default class EmbedBuilder extends DiscordEmbedBuilder {
  constructor() {
    super();
  }

  /**
   * A helper function to create an embed
   *
   * @param title Title of the embed
   * @param description Description of the embed
   * @param color A Color for the embed
   * @returns {EmbedBuilder} The embed or an array of embeds
   */
  public static create(title: string, description: string, color: ColorResolvable): EmbedBuilder;
  /**
   * A helper function to create an embed
   *
   * @param title Title of the embed
   * @param description Description of the embed
   * @param color A Color for the embed
   * @param array If the embed should be returned as an array
   * @returns {EmbedBuilder[]} The embed or an array of embeds
   */
  public static create(title: string, description: string, color: ColorResolvable, array: boolean): EmbedBuilder[];
  public static create(title: string, description: string, color: ColorResolvable, array: boolean = false): EmbedBuilder | EmbedBuilder[] {
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color);

    return array ? [embed] : embed;
  }
}