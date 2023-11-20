import type { Level } from "@enums/level";

export default interface Configuration {
  /**
   * Log level of the bot. This is used to determine what to log.
   * 0 = No logs
   * 1 = Info
   * 2 = Warnings
   * 3 = Errors
   * 4 = Debug (Not recommended for production)
   */
  logLevel: Level;
}