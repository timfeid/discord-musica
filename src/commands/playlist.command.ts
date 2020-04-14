import { Command } from "./command"
import { Guild } from "../data/entities/guild"
import { Message, User, StreamDispatcher, Channel, VoiceChannel, TextChannel } from "discord.js"
import ytdl from 'ytdl-core'
import {SongInfo, getCurrentPlayer} from '../player'
import playlist from "../services/search"

export default class PlayCommand extends Command {
  static trigger = /^playlist (.*)$/

  async handle() {
    if (!this.channelCheck() || !this.permissionsCheck()) {
      return
    }

    const results = await playlist(this.args[0])
    if (results) {
      const titles: string[] = []
      for (const song of results) {
        const player = await getCurrentPlayer(this.guild.id)
        player.once('added', () => {
          titles.push(song.title)
        }).add({
          voiceChannel: this.voiceChannel as VoiceChannel,
          textChannel: this.message.channel as TextChannel,
          info: {
            url: song.url,
            title: song.title,
          },
        })
      }

      this.message.channel.send(`added \n\n${titles.join('\n')}`)

    } else {
      this.respondConfused()
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