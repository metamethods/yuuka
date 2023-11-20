import Event from "@schemas/Event";
import Log from "@schemas/Log";

import { Level } from "@enums/level";

export default new Event("once", "ready", (client) => {
  Log.emit(`Logged in as ${client.user?.tag}`, Level.Info);
})