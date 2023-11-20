import config from "config.cjs";

import chalk from "chalk";

import { Level } from "@enums/level";

export default class Log {
  constructor() {}

  public static emit(message: string, level: Level) {
    if (level > config.logLevel)
      return;

    // TODO: Optimize/Refactor this
    switch (level) {
      case Level.Info:
        console.log(`${chalk.blueBright("[info]")} ${message}`);
        break;
      case Level.Warning:
        console.log(`${chalk.yellowBright("[warning]")} ${message}`);
        break;
      case Level.Error:
        console.log(`${chalk.redBright("[error]")} ${message}`);
        break;
      case Level.Debug:
        console.log(`${chalk.magentaBright("[debug]")} ${message}`);
        break;
      default:
        console.log(message);
        break;
    }
  }
}