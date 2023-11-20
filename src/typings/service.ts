export type Options = Partial<{
  /**
   * Time to wait until running the service again (Time in milliseconds)
   */
  interval: number;

  /**
   * The priority of this service. Higher priority services will be started first
   *
   * @default 0
   */
  priority: number;
}>

export interface HandlerOptions {

}

export interface ServiceOptions {
  /**
   * Name of the service
   */
  name: string;

  /**
   * Handles the service
   *
   * @param options All the options of the service
   * @returns {void}
   */
  handler: (options: HandlerOptions) => void;

  /**
   * Options of the service
   */
  options: Options;
}