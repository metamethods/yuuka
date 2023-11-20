import type { CommandOptions } from "@typings/command";
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

export default class Command implements CommandOptions {
  public data: CommandOptions["data"];
  public handler: CommandOptions["handler"];
  public metadata: CommandOptions["metadata"];
  public name: string;

  constructor(options: CommandOptions) {
    this.data = options.data;
    this.handler = options.handler;
    this.name = options.data.name;
    this.metadata = options.metadata ?? {};
  }

  public toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
    return this.data.toJSON();
  }
}