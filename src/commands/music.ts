import { SlashCommandBuilder } from "discord.js";
import { Messages } from "@enums/messages";

import Command from "@schemas/Command";
import EmbedBuilder from "@schemas/EmbedBuilder";

import toHHMMSS from "@utility/toHHMMSS";
import playdl from "play-dl";
import format from "@utility/format";

import type { ChatInputCommandInteraction, GuildMember, VoiceBasedChannel } from "discord.js";
import type { Queue, Track } from "@classes/MusicPlayer";
import type { YouTubeVideo } from "play-dl";
import type Client from "@classes/Client";

interface MusicParams {
  interaction: ChatInputCommandInteraction;
  client: Client;
  channel: VoiceBasedChannel;
  member: GuildMember;
  queue?: Queue;
}

async function musicSearch({ interaction, client, channel, member }: MusicParams) {
  const query = interaction.options.getString("query", true);
  const isUrl = interaction.options.getBoolean("isurl") ?? false;

  await interaction.deferReply({ ephemeral: true });

  let track: YouTubeVideo;

  if (isUrl) {
    track = (await playdl.video_info(query))?.video_details;
  } else {
    const tracks = await playdl.search(query, { source: { youtube: "video" }, limit: 1 });
    track = tracks[0];
  }

  if (!track) 
    return await interaction.editReply(Messages.MUSIC_TRACK_NOT_FOUND);

  client.musicPlayer.playYoutube(channel, track, { requestedBy: member, interaction });

  await interaction.editReply(Messages.MUSIC_TRACK_ADDED);
}

async function musicStop({ interaction, queue }: MusicParams) {
  if (!queue) return await interaction.reply(Messages.MUSIC_NOT_PLAYING);

  queue.destroy();
  await interaction.reply(Messages.MUSIC_STOPPED);
}

async function musicSkip({ interaction, queue }: MusicParams) {
  if (!queue) return await interaction.reply(Messages.MUSIC_NOT_PLAYING);

  queue.skip();
  await interaction.reply(Messages.MUSIC_SKIPPED);
}

async function musicShuffle({ interaction, queue }: MusicParams) {
  if (!queue) return await interaction.reply(Messages.MUSIC_NOT_PLAYING);

  queue.shuffle();
  await interaction.reply(Messages.MUSIC_SHUFFLED);
}

async function removeTrack({ interaction, queue }: MusicParams) {
  if (!queue) return await interaction.reply(Messages.MUSIC_NOT_PLAYING);

  const trackIndex = interaction.options.getInteger("track", true);

  try {
    const track = queue.removeTrack(trackIndex - 1);
    await interaction.reply({
      content: format(Messages.MUSIC_TRACK_REMOVED, {
        track_name: track.data.title,
        track_url: track.data.url
      }),
      ephemeral: true
    });
  } catch {
    await interaction.reply(Messages.MUSIC_TRACK_NOT_FOUND);
  }
}

async function musicQueue({ interaction, queue }: MusicParams) {
  if (!queue) return await interaction.reply(Messages.MUSIC_NOT_PLAYING);

  const currentTrack = queue.currentTrack;
  if (!currentTrack) return await interaction.reply(Messages.MUSIC_QUEUE_NOT_FOUND);

  const page = interaction.options.getInteger("page") ?? 1;
  const viewableTracks = queue.tracks.slice((page - 1) * 10, page * 10);

  const formatTrackData = (track: Track) => `[${track.data.title}](${track.data.url}) \`[${toHHMMSS(track.data.length ?? 0)}]\` - Requested by <@${track.data.metadata?.requestedBy.id ?? "Unknown"}>`;

  const tracks = viewableTracks.map(
    (track, index) => `**${index + 1 + ((page-1) * 10)}.** ${formatTrackData(track)}`
  );
  
  const layout = [
    "**Currently Playing**",
    `${formatTrackData(currentTrack)}`,
    "",
    "**Queue**",
    ...tracks
  ]

  await interaction.reply({
    content: Messages.MUSIC_QUEUE,
    embeds: [
      EmbedBuilder.create("Queue", layout.join("\n"), "Orange")
        .setThumbnail(currentTrack?.data.thumbnail ?? "")
        .setFooter({ text: `Page ${page} of ${Math.ceil(queue.tracks.length / 10)}` })
    ]
  })
}

async function musicPause({ interaction, queue }: MusicParams) {
  if (!queue) return await interaction.reply(Messages.MUSIC_NOT_PLAYING);

  queue.pause();
  await interaction.reply(Messages.MUSIC_PAUSED);
}

async function musicResume({ interaction, queue }: MusicParams) {
  if (!queue) return await interaction.reply(Messages.MUSIC_NOT_PLAYING);

  queue.resume();
  await interaction.reply(Messages.MUSIC_RESUMED);
}

async function musicLoop({ interaction, queue }: MusicParams) {
  if (!queue) return await interaction.reply(Messages.MUSIC_NOT_PLAYING);

  queue.setLoop(!queue.looped);
  await interaction.reply(
    queue.looped ? Messages.MUSIC_LOOP_ENABLE : Messages.MUSIC_LOOP_DISABLE
  );
}

export default new Command({
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Says hello")

    .addSubcommand(subCommand => subCommand
      .setName("play")
      .setDescription("Plays a song")
      .addStringOption(option => option
        .setName("query")
        .setDescription("The search query")
        .setRequired(true)
      )
      .addBooleanOption(option => option
        .setName("isurl")
        .setDescription("If the query is a url")
        .setRequired(false)
      )
    )
    
    .addSubcommand(subCommand => subCommand
      .setName("stop")
      .setDescription("Stops the music")
    )
    
    .addSubcommand(subCommand => subCommand
      .setName("skip")
      .setDescription("Skips the current song")
    )

    .addSubcommand(subCommand => subCommand
      .setName("shuffle")
      .setDescription("Shuffles the queue")
    )

    .addSubcommand(subCommand => subCommand
      .setName("remove")
      .setDescription("Removes a track from the queue")
      .addIntegerOption(option => option
        .setName("track")
        .setDescription("The track to remove")
        .setRequired(true)
      )
    )

    .addSubcommand(subCommand => subCommand
      .setName("pause")
      .setDescription("Pauses the music")
    )

    .addSubcommand(subCommand => subCommand
      .setName("resume")
      .setDescription("Resumes the music")
    )

    .addSubcommand(subCommand => subCommand
      .setName("loop")
      .setDescription("Loops the queue")
    )

    .addSubcommand(subCommand => subCommand
      .setName("queue")
      .setDescription("Shows the queue")
      .addIntegerOption(option => option
        .setName("page")
        .setDescription("The page of the queue")
        .setRequired(false)
      )
    )
    ,
  handler: async ({ interaction, member, client }) => {
    const channel = member?.voice.channel;

    if (!channel) 
      return await interaction.reply(Messages.MUSIC_NOT_IN_VOICE_CHANNEL);

    const queue = client.musicPlayer.getQueue(channel);

    if (queue?.connection?.joinConfig.channelId !== channel.id && queue) 
      return await interaction.reply(Messages.MUSIC_NOT_IN_SAME_VOICE_CHANNEL);

    const subCommand = interaction.options.getSubcommand();
    const params = { interaction, client, channel, member, queue }

    switch (subCommand) {
      case "play": await musicSearch(params); break;
      case "stop": await musicStop(params); break;
      case "skip": await musicSkip(params); break;
      case "queue": await musicQueue(params); break;
      case "shuffle": await musicShuffle(params); break;
      case "remove": await removeTrack(params); break;
      case "pause": await musicPause(params); break;
      case "resume": await musicResume(params); break;
      case "loop": await musicLoop(params); break;
    }
  }
})