import Client from "@";

import Log from "@schemas/Log";
import EmbedBuilder from "@schemas/EmbedBuilder";

import { checkInteraction, isRepliedOrDeferred } from "@middleware";

import booleanSwitch from "@utility/booleanSwitch";

import { Level } from "@enums/level";

import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export function command(interaction: ChatInputCommandInteraction) {
  const command = Client.commands.get(interaction.commandName);

  if (!command) return Log.emit(`Command ${interaction.commandName} not found`, Level.Error);
  if (command.metadata?.disabled) return interaction.reply({ content: "This command is currently disabled", ephemeral: true });

  Log.emit(`Checking if interaction is unknown`, Level.Debug);
  if (!checkInteraction(interaction))
    return Log.emit(`Interaction lifetime has been over 3 seconds`, Level.Error);

  Log.emit(`Running command ${command.name}`, Level.Debug);

  command.handler({
    interaction,
    client: Client,
    author: interaction.user,
    member: interaction.member as GuildMember,
    channel: interaction.channel
  })
  .then(() => Log.emit(`Command ${command.name} has executed with no errors!`, Level.Debug))
  .catch(error => {
    if (!(error instanceof Error))
      return Log.emit(`Command ${command.name} has thrown an unknown error`, Level.Error);

    booleanSwitch(
      isRepliedOrDeferred(interaction),
      { embeds: EmbedBuilder.create("Error", `An error has occurred:\n\`\`\`${error.stack}\`\`\``, "Orange", true), ephemeral: true },
      data => interaction.followUp(data),
      data => interaction.reply(data),
    );
  });
}