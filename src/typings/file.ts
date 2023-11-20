export type ImportOptions = Partial<{
  /**
   * Use the default export of the file
   */
  default: boolean;

  /**
   * Clear the cache of the file when importing
   */
  clearCache: boolean;

  /**
   * Use the src directory and append it to the path
   */
  useSrcDirectory: boolean;
}>

export type GlobOptions = Partial<{
  /**
   * Use the src directory and append it to the path
   */
  useSrcDirectory: boolean;
}>