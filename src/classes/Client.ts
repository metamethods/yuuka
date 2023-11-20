import { Client as DiscordClient } from "discord.js";

import Commands from "@classes/Commands";

import File from "@schemas/File";
import Log from "@schemas/Log";

import { Level } from "@enums/level";

import type { ClientOptions } from "discord.js";

import type Command from "@schemas/Command";
import type Event from "@schemas/Event";
import type Job from "@schemas/Job";

export default class Client extends DiscordClient {
  public _token: string;
  public _id: string;

  public commands: Commands = new Commands();

  constructor(
    options: ClientOptions,
    token: string,
    id: string
  ) {
    super(options);

    this._token = token;
    this._id = id;
  }

  /**
   * Loads all commands from the commands directory.
   * @returns {Promise<void>}
   */
  private async loadCommands(): Promise<void> {
    for (const file of await File.glob("commands/**/*.{ts,js}", { useSrcDirectory: true })) {
      const command = await file.import<Command>({ default: true })

      this.commands.add(command);
      Log.emit(`Loaded command ${command.name}`, Level.Debug);
    }
  }

  /**
   * Invoke events.
   * @returns {Promise<void>}
   */
  private async invokeEvents(): Promise<void> {
    for (const file of await File.glob("events/**/*.{ts,js}", { useSrcDirectory: true })) {
      const event = await file.import<Event<never>>({ default: true });

      this[event.type](event.event, event.callback);
      Log.emit(`Invoked event ${file.name}`, Level.Debug);
    }
  }

  /**
   * Loads all jobs from the jobs directory.
   * @returns {Promise<void>}
   */
  private async startJobs(): Promise<void> {
    const jobs = [];

    for (const file of await File.glob("jobs/**/*.{ts,js}", { useSrcDirectory: true })) {
      const job = await file.import<Job>({ default: true });

      if (job.options.ignore) {
        Log.emit(`Ignored Job ${job.name}`, Level.Debug);
        continue;
      }

      jobs.push(job);
    }

    jobs.sort((jobA, jobB) => (jobA.options.priority ?? 0) - (jobB.options.priority ?? 0));

    for (const job of jobs) {
      job.start();
      Log.emit(`Started Job ${job.name}`, Level.Debug);
    }
  }

  /**
   * Starts the discord client and its components.
   *
   * @returns {void}
   */
  public async start(): Promise<void> {
    Log.emit("Started jobs", Level.Info);
    Log.emit("Invoking events...", Level.Debug);

    await this.invokeEvents();

    Log.emit("Invoked events", Level.Info);
    Log.emit("Registering commands...", Level.Debug);

    await this.loadCommands();

    Log.emit("Loaded commands", Level.Info);
    Log.emit(`Loaded ${this.commands.size()} commands`, Level.Debug);
    Log.emit("Publishing commands...", Level.Info);

    this.commands.publish(this._token, this._id)
      .catch(error => Log.emit(error.message, Level.Error))
      .finally(() => Log.emit("Published commands", Level.Info));

    Log.emit("Logging in...", Level.Info);

    await this.login(this._token)
      .catch(error => Log.emit(error.message, Level.Error))
      .finally(() => Log.emit("Promise fulfilled", Level.Debug));

    Log.emit("Starting post login actions...", Level.Debug);
    Log.emit("Starting jobs...", Level.Debug);

    await this.startJobs();
  }
}