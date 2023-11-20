import Job from "@schemas/Job";
import File from "@schemas/File";
import Log from "@schemas/Log";

import booleanSwitch from "@utility/booleanSwitch";

import { Level } from "@enums/level";

import type Service from "@schemas/Service";

export default new Job("Service Handler", async () => {
  const services = [];

  for (const file of await File.glob("services/**/*.{ts,js}", { useSrcDirectory: true })) {
    const service = await file.import<Service>({ default: true });

    services.push(service);
  }

  services.sort((serviceA, serviceB) => (serviceA.options.priority ?? 0) - (serviceB.options.priority ?? 0));

  for (const service of services) {
    const handlerOptions = {};

    booleanSwitch(
      service.options.interval === undefined,
      service.handler,
      (handler) => handler(handlerOptions),
      (handler) => setInterval(() => handler(handlerOptions), service.options.interval)
    );

    Log.emit(`Loaded service ${service.name}`, Level.Debug);
  }
});