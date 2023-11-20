import type { Client, TextChannel } from "discord.js";

export default async function getTextChannel(client: Client, channelId: string): Promise<TextChannel | null> {
  const channel = await client.channels.fetch(channelId)
    .catch(() => null);
    
  if (!channel?.isTextBased())
    return null;

  return channel as TextChannel;
}