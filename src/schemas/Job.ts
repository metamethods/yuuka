export default class Job<CallbackReturnT = never> {
  constructor(
    public name: string,
    public callback: () => CallbackReturnT,
    public options: Partial<{
      /**
       * Ignores this file from being loaded by the client class
       *
       * @default false
       */
      ignore: boolean;

      /**
       * The priority of this job. Higher priority jobs will be started first
       *
       * @default 0
       */
      priority: number;
    }> = {}
  ) {}

  public async start(): Promise<CallbackReturnT> {
    return await this.callback();
  }
}