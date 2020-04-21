import { Command } from "./command"
import { Guild } from "../data/entities/guild"
import { Message, User, StreamDispatcher, Channel, VoiceChannel, TextChannel } from "discord.js"
import ytdl from 'ytdl-core'
import {SongInfo, getCurrentPlayer} from '../player'
import search from "../services/search"

export default class PlayCommand extends Command {
  static trigger = /^play (.*)$/

  async handle() {
    if (!this.channelCheck() || !this.permissionsCheck()) {
      return
    }

    try {
      let info: SongInfo
      if (this.args[0].startsWith('http') || (/^[A-Za-z0-9_-]{11}$/).test(this.args[0])) {
        info = await this.getSong(this.args[0])
      } else {
        const results = await search(this.args[0])
        info = {
          url: results[0].url,
          title: results[0].title,
        }
      }
    } catch (e) {
      console.log(e, 'part 1')
      return
    }

    try {
      const player = await getCurrentPlayer(this.guild.id)
      player.once('added', () => {
        this.message.channel.send(player.isPlaying ? `added ${info.title} to the queue` : `playing ${info.title}`)
      }).add({
        voiceChannel: this.voiceChannel as VoiceChannel,
        textChannel: this.message.channel as TextChannel,
        info,
      })
    } catch (e) {
      this.message.channel.send(e.message || 'somethin went wrong man')
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