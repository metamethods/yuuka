import type { ClientEvents } from "discord.js"

/**
 * Represents an event
 */
export default class Event<Key extends keyof ClientEvents & unknown> {
  /**
   * Creates a new event
   *
   * @param type Type of event to listen to. On is for listening to events forever, once is for listening to events once
   * @param event Event to listen to
   * @param callback Callback to run when the event is emitted
   */
  constructor(
    public type: "on" | "once",
    public event: Key,
    public callback: (...args: ClientEvents[Key]) => void
  ) {}
}