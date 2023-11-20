import { Collection, REST, Routes } from "discord.js";

import type Command from "@schemas/Command";

export default class Commands {
  public commands: Collection<string, Command> = new Collection();

  constructor() {}

  /**
   * @param command The command to be added to the collection
   * @returns {void}
   */
  public add(command: Command): void {
    this.commands.set(command.name, command);
  }

  /**
   * Removes a command from the collection
   * @param command The command to be removed from the collection
   * @returns {void}
   */
  public remove(command: Command): void {
    this.commands.delete(command.name);
  }

  /**
   * Retrieves a command from the collection
   * @param name The name of the command to be retrieved
   * @returns {Command | undefined} The command that was retrieved
   */
  public get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  /**
   * Clears the collection of commands
   * @returns {void}
   */
  public clear(): void {
    this.commands.clear();
  }

  /**
   * Gets the current size of the collection
   * @returns {number} The size of the collection
   */
  public size(): number {
    return this.commands.size;
  }

  /**
   * @param token The token of the bot to be used for authentication
   * @param clientId The id of the bot
   * @returns {Promise<boolean>} Whether or not the commands were published successfully
   */
  public async publish(token: string, clientId: string): Promise<void> {
    const rest = new REST().setToken(token);
    const commands = this.commands.map(command => command.toJSON());

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );
  }
}