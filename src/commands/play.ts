import { Command } from "./command"
import { Guild } from "../data/entities/guild"
import { Message, User, StreamDispatcher, Channel, VoiceChannel, TextChannel } from "discord.js"
import ytdl from 'ytdl-core'

interface SongInfo {
  title: string
  url: string
}

interface PlaySong {
  voiceChannel: VoiceChannel
  textChannel: TextChannel
  song: SongInfo
}

let queue: Record<number, PlaySong[]> = {}
let currentDispatcher: Record<number, StreamDispatcher> = {}

export function getCurrentDispatcher(guildId: number) {
  return currentDispatcher[guildId]
}

export default class PlayCommand extends Command {
  static trigger = /^play (\S+)$/

  async handle() {
    if (!this.channelCheck() || !this.permissionsCheck()) {
      return
    }

    try {
      const song = await this.getSong(this.args[0])
      this.addToQueue({
        voiceChannel: this.voiceChannel as VoiceChannel,
        textChannel: this.message.channel as TextChannel,
        song,
      })

      if (!currentDispatcher[this.guild.id]) {
        this.play()
      } else {
        this.message.channel.send(`added ${song.title} to the mixxxx`)
      }
    } catch (e) {
      this.message.channel.send(e.message)
    }
  }

  addToQueue(playSong: PlaySong) {
    if (!queue[this.guild.id]) {
      queue[this.guild.id] = []
    }

    queue[this.guild.id].push(playSong)
  }

  nextSong() {
    if (!queue[this.guild.id]) {
      return
    }

    return queue[this.guild.id].shift()
  }

  async play () {
    const nextSong = this.nextSong()
    if (nextSong) {
      const channelConnection = await this.voiceChannel!.join()
      currentDispatcher[this.guild.id] = channelConnection.play(ytdl(nextSong.song.url))
      currentDispatcher[this.guild.id].on('start', () => console.log('we started?'))
      currentDispatcher[this.guild.id].on('error', e => console.log(e))
      currentDispatcher[this.guild.id].on('finish', () => {
        delete currentDispatcher[this.guild.id]
        this.play()
      })
      currentDispatcher[this.guild.id].setVolumeLogarithmic(this.guild.volume / 100)
    }
  }

  async getSong (url: string): Promise<SongInfo> {
    const songInfo = await ytdl.getInfo(url)
    return {
      title: songInfo.title,
      url: songInfo.video_url,
    }
  }

  channelCheck () {
    if (!this.voiceChannel) {
      this.message.channel.send('You need to be in a voice channel to play music!')
      return false
    }

    return true
  }

  permissionsCheck () {
    const permissions = this.voiceChannel!.permissionsFor(this.message.client.user as User)
    if (!permissions || !permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      this.message.channel.send('I need the permissions to join and speak in your voice channel!')
      return false
    }

    return true
  }
}