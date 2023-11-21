import type { GuildMember, ChatInputCommandInteraction } from "discord.js";

export interface DefaultTrackMetadata {
  requestedBy: GuildMember,
  interaction: ChatInputCommandInteraction
}

export interface TrackData<TMetadata = DefaultTrackMetadata> {
  url: string,
  title: string,
  thumbnail: string,
  length?: number,

  metadata?: TMetadata
}

export interface MusicPlayerMetadata {
  interaction?: ChatInputCommandInteraction
}

export interface Events {
  trackStart: (track: TrackData) => void,
  trackRemove: (track: TrackData) => void,
  trackAdded: (track: TrackData[]) => void,
  error: (error: unknown, metadata: MusicPlayerMetadata | undefined) => void,
}