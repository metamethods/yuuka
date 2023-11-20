export enum Level {
  /**
   * No logs
   */
  None = 0,

  /**
   * Shows info about the bot such as it starting up, shutting down, etc
   */
  Info = 1,

  /**
   * Any warnings that gotten emitted by the bot
   */
  Warning = 2,

  /**
   * Errors that are emitted by the bot, but are handled
   */
  Error = 3,

  /**
   * Shows debug information about the bot. This is not recommended for production
   */
  Debug = 4
}