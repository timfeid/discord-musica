import { VoiceChannel, TextChannel, StreamDispatcher, VoiceConnection } from "discord.js";
import ytdl from 'ytdl-core'
import { EventEmitter } from "typeorm/platform/PlatformTools";
import { Guild } from "../data/entities/guild";
import GuildService from '../services/guild'

export interface SongInfo {
  title: string
  url: string
}

export interface PlaySong {
  voiceChannel: VoiceChannel
  textChannel: TextChannel
  info: SongInfo
}

export class Player extends EventEmitter {
  protected queue: PlaySong[] = []
  protected dispatcher?: StreamDispatcher
  protected guildId: number

  constructor(guildId: number) {
    super()
    this.guildId = guildId
  }

  async play (song: PlaySong) {
    const connection = await song.voiceChannel.join()
    this.dispatcher = this.createDispatcher(connection, song)
    this.setVolume(GuildService.find(this.guildId).volume)
  }

  createDispatcher (connection: VoiceConnection, song: PlaySong) {
    const dispatcher = connection.play(ytdl(song.info.url))

    dispatcher.on('finish', this.skip)

    return dispatcher
  }

  pause () {
    this.dispatcher?.pause()
  }

  skip () {
    this.dispatcher?.destroy()

    if (this.queue.length > 0) {
      this.play(this.queue.shift()!)
    }
  }

  add (song: PlaySong) {
    this.queue.push(song)

    if (!this.dispatcher) {
      this.skip()
    }

    this.emit('added')
  }

  setVolume (volume: number) {
    this.dispatcher?.setVolumeLogarithmic(volume / 100)
  }

  get isPlaying () {
    return !!this.dispatcher
  }
}

const players: Record<number, Player> = {}

export async function getCurrentPlayer(guildId: number) {
  if (!players[guildId]) {
    players[guildId] = new Player(guildId)
  }

  return players[guildId]
}
