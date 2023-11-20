import type { ServiceOptions } from "@typings/service";

export default class Service implements ServiceOptions {
  public name: ServiceOptions["name"];
  public handler: ServiceOptions["handler"];
  public options: ServiceOptions["options"];

  constructor(options: ServiceOptions) {
    this.name = options.name;
    this.handler = options.handler;
    this.options = options.options;
  }
}