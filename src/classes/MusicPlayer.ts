import { Collection } from "discord.js";
import { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } from "@discordjs/voice";

import play from "play-dl";

import type { TrackData, Events, MusicPlayerMetadata, DefaultTrackMetadata } from "@typings/musicPlayer";
import type { Client, VoiceBasedChannel } from "discord.js";
import type { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import type { YouTubeVideo } from "play-dl";

/**
 * Track data to be used when playing a song
 */
export class Track {
  constructor(
    public data: TrackData,
  ) { }
}

/**
 * Contains all the tracks that are currently in the queue for a specific guild
 */
export class Queue {
  public tracks: Track[] = [];
  public currentTrack: Track | null = null;
  public connection: VoiceConnection | null = null;
  public player: AudioPlayer = createAudioPlayer();

  public looped = false;

  constructor(
    public client: Client,
    public channel: VoiceBasedChannel,
    private musicPlayer: MusicPlayer,
    public metadata?: MusicPlayerMetadata
  ) { }

  /**
   * Plays the next track in the queue creating an infinite loop until the queue is empty and or the connection is destroyed
   */
  private async playTrack(track: Track) {
    if (!this.connection) return;

    this.currentTrack = track;
    this.musicPlayer.getEvent("trackStart")(this.currentTrack.data);

    const stream = await play.stream(track.data.url);
    const resource = createAudioResource(stream.stream, {
      inlineVolume: true,
      inputType: stream.type
    });

    this.player.play(resource);
  }

  /**
   * Plays the next track
   */
  private async nextTrack() {
    const track = this.getNextTrack();
    if (!track) return;

    await this.playTrack(track);
  }

  /**
   * Gets the next track. If looped is set to true, the track will be given and moved to the back of the list, else the track will be removed from the queue.
   */
  private getNextTrack() {
    if (this.tracks.length === 0) return this.destroy();

    if (this.looped) {
      const track = this.tracks[0];
      this.tracks.push(this.tracks.splice(0, 1)[0]); // Move the track to the back of the list
      return track;
    }

    return this.tracks.shift();
  }

  /**
   * Joins the voice channel, and sets up the player
   */
  public join() {
    if (this.connection) return;

    this.connection = joinVoiceChannel({
      channelId: this.channel.id,
      guildId: this.channel.guild.id,
      adapterCreator: this.channel.guild.voiceAdapterCreator
    });

    this.connection.subscribe(this.player);

    this.connection.on("stateChange", (_, newState) => {
      if (newState.status === "disconnected") this.destroy();
      if (newState.status === "ready") this.nextTrack();
    });

    //// this.player.on(AudioPlayerStatus.Playing, () => {/* empty */}); 
    this.player.on(AudioPlayerStatus.Idle, () => {
      if (this.looped) 
        this.addToQueue([this.currentTrack as Track]);

      this.nextTrack();
    });

    // Handle errors
    this.connection.on("error", error => {
      this.musicPlayer.getEvent("error")(error, this.metadata);
    });

    this.player.on("error", error => {
      this.musicPlayer.getEvent("error")(error, this.metadata);
    });
  }

  /**
   * Shuffles the queue
   */
  public shuffle() {
    let currentIndex = this.tracks.length, randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [this.tracks[currentIndex], this.tracks[randomIndex]] =
        [this.tracks[randomIndex], this.tracks[currentIndex]];
    }

    return this.tracks;
  }

  /**
   * Pauses the current track
   */
  public pause() {
    return this.player.pause();
  }

  /**
   * Resumes the current track
   */
  public resume() {
    return this.player.unpause();
  }

  /**
   * Skips the current track
   */
  public skip() {
    this.player.stop();
  }

  /**
   * Sets the loop setting of the player
   */
  public setLoop(loop: boolean) {
    this.looped = loop;
  }

  /**
   * Removes a track from the queue
   */
  public removeTrack(index: number) {
    const track = this.tracks[index];
    if (!track) throw new Error("Unable to find the track.");

    this.tracks.splice(index, 1);
    this.musicPlayer.getEvent("trackRemove")(track.data);

    return track;
  }

  /**
   * Destroys the queue
   */
  public destroy() {
    if (!this.connection) throw new Error("Unable to find the connection.");
    this.connection.destroy();
    this.tracks = [];
    this.connection = null;
    this.musicPlayer.queues.delete(this.channel.guildId);
  }

  public addToQueue(track: Track[]) {
    this.tracks.push(...track);
    this.musicPlayer.getEvent("trackAdded")(track.map(t => t.data));
  }
}

/**
 * Main class for the music player
 */
export class MusicPlayer {
  public queues: Collection<string, Queue> = new Collection();
  public events: { [key: string]: unknown } = {};

  constructor(
    public client: Client,
    public metadata?: MusicPlayerMetadata
  ) { 
    client.on("voiceStateUpdate", async () => {
      for (const queue of this.queues.values()) {
        if (queue.channel.members.size <= 1) {
          queue.destroy();
        }
      }
    });
  }

  private join(channel: VoiceBasedChannel) {
    if (this.queues.has(channel.guildId)) return this.queues.get(channel.guildId);
    return this.queues.set(channel.guildId, new Queue(this.client, channel, this, this.metadata)).get(channel.guildId);
  }

  public play(channel: VoiceBasedChannel, track: Track[]) {
    const queue = this.join(channel);
    if (!queue) throw new Error("Unable to find the queue.");
    if (queue.channel.id !== channel.id) throw new Error("Cannot have multiple queues in different channels in the same guild.");
    queue.join();
    queue.addToQueue(track);
  }

  public playYoutube(channel: VoiceBasedChannel, youtubeVideo: YouTubeVideo, metadata: DefaultTrackMetadata) {
    const track = new Track({
      url: youtubeVideo.url,
      title: youtubeVideo.title ?? "Unknown",
      thumbnail: youtubeVideo.thumbnails[0].url,
      length: youtubeVideo.durationInSec,
      metadata
    })

    this.play(channel, [track]);
  }

  public getQueue(channel: VoiceBasedChannel) {
    return this.queues.get(channel.guildId);
  }

  public on<Key extends keyof Events>(event: Key, callback: Events[Key]) {
    this.events[event] = callback;
  }

  public getEvent<Key extends keyof Events>(event: Key): Events[Key] {
    return this.events[event] as Events[Key];
  }
}