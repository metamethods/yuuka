/**
 * Converts a path into UNIX format
 *
 * @param path The path to be converted
 * @returns {string} The converted path into UNIX format
 */
export default function toUNIX(path: string): string {
  return path.replace(/\\/g, "/");
}