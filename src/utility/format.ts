export default function format(text: string, pattern: Record<string, number | string>): string {
  for (const [key, value] of Object.entries(pattern))
    text = text.replace(new RegExp(`%${key}%`, "g"), value.toString());

  return text;
}