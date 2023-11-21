export enum Messages {
  GREETING = "Hello, <@%author%> sensei.",

  BOORU_IMAGE_SENT = "Um, here's your image sensei.",
  BOORU_IMAGE_NOT_FOUND = "Sorry sensei, this is too embarrassing for me to show you.",

  MUSIC_NOT_IN_VOICE_CHANNEL = "Sensei, you need to be in a voice channel.",
  MUSIC_NOT_IN_SAME_VOICE_CHANNEL = "Sensei, I think you're in the wrong voice channel.",
  MUSIC_QUEUE_NOT_FOUND = "Sensei, I can't find any music in the queue.",
  MUSIC_TRACK_NOT_FOUND = "Sensei, I'm not sure what song that is.",
  MUSIC_TRACK_ADDED = "Sensei, I've added the track to the queue.",
  MUSIC_NOT_PLAYING = "Sensei, I'm not playing any music right now.",
  MUSIC_STOPPED = "Goodbye sensei.",
  MUSIC_SKIPPED = "I've skipped the track sensei.",
  MUSIC_QUEUE = "Here's the queue sensei.",
  MUSIC_SHUFFLED = "I've shuffled the queue for you sensei.",
  MUSIC_TRACK_REMOVED = "I've removed [%track_name%](<%track_url%>) from the queue sensei.",
  MUSIC_PAUSED = "I've paused the music sensei.",
  MUSIC_RESUMED = "I'll continue sensei.",
  MUSIC_LOOP_ENABLE = "I'll loop the queue for you sensei.",
  MUSIC_LOOP_DISABLE = "I won't loop the queue anymore sensei.",
}