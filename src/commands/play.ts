import { Command } from "./command"
import { Guild } from "../data/entities/guild"
import { Message, User, StreamDispatcher } from "discord.js"
import ytdl from 'ytdl-core'

let currentDispatcher: StreamDispatcher

export function getCurrentDispatcher() {
  return currentDispatcher
}

export default class PlayCommand extends Command {
  static trigger = /^play (\S+)$/

  async handle() {
    if (!this.channelCheck() || !this.permissionsCheck()) {
      return
    }

    try {
      const song = await this.getSong(this.args[0])
      const channelConnection = await this.voiceChannel!.join()
      currentDispatcher = channelConnection.play(ytdl(song.url))
      currentDispatcher.on('start', () => console.log('we started?'))
      currentDispatcher.on('error', err => this.message.channel.send(err.message))
      currentDispatcher.on('finish', () => this.message.channel.send('done'))
      currentDispatcher.setVolumeLogarithmic(this.guild.volume / 100)
    } catch (e) {
      this.message.channel.send(e.message)
    }
  }

  async getSong (url: string) {
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