import { ActivityType } from "discord.js";

import Client from "@";

import Service from "@schemas/Service";
import Log from "@schemas/Log";

import { Level } from "@enums/level";

export default new Service({
  name: "Server Counter",
  handler: async () => {
    const guilds = await Client.guilds.fetch()
      .then((guilds) => guilds.size)
      .catch((error) => error);

    if (guilds instanceof Error)
      return Log.emit(`Failed to fetch guilds with the reason of:\n${guilds.message}\nstack:${guilds.stack}`, Level.Error);

    Client.user?.setActivity(`${guilds} server${guilds > 1 ? "s" : ""}`, { type: ActivityType.Watching });
  },
  options: {
    interval: 5000
  }
})