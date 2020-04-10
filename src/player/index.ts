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
  protected _queue: PlaySong[] = []
  protected dispatcher?: StreamDispatcher
  protected guildId: number
  protected currentSong?: PlaySong

  constructor(guildId: number) {
    super()
    this.guildId = guildId
  }

  async play (song: PlaySong) {
    const connection = await song.voiceChannel.join()
    this.dispatcher = this.createDispatcher(connection, song)
    this.currentSong = song
    this.setVolume(GuildService.find(this.guildId).volume)
  }

  createDispatcher (connection: VoiceConnection, song: PlaySong) {
    const dispatcher = connection.play(ytdl(song.info.url), {
      filter: "audioonly",
      highWaterMark: 1 << 25
    })

    dispatcher.on('finish', () => this.skip())
    dispatcher.on('error', e => {

      song.textChannel.send(`hmmm something happened with that one, sorry ${e.message}`)
      this.skip()
    })

    return dispatcher
  }

  pause () {
    this.dispatcher?.pause()
  }

  skip () {
    this.dispatcher?.destroy()
    this.currentSong = undefined

    if (this._queue.length > 0) {
      this.play(this._queue.shift()!)
    }
  }

  add (song: PlaySong) {
    this._queue.push(song)

    if (!this.currentSong) {
      this.skip()
    }

    this.emit('added')
  }

  setVolume (volume: number) {
    this.dispatcher?.setVolumeLogarithmic(volume / 100)
  }

  delete (position: number) {
    this._queue.splice(position, 1)
  }

  get isPlaying () {
    return !!this.currentSong
  }

  get currentlyPlaying () {
    return this.currentSong
  }

  get queue () {
    return this._queue
  }
}

const players: Record<number, Player> = {}

export async function getCurrentPlayer(guildId: number) {
  if (!players[guildId]) {
    players[guildId] = new Player(guildId)
  }

  return players[guildId]
}
