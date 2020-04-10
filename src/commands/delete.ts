import { Command } from "./command"
import { Guild } from "../data/entities/guild"
import { Message, User, StreamDispatcher, Channel, VoiceChannel, TextChannel } from "discord.js"
import ytdl from 'ytdl-core'
import {SongInfo, getCurrentPlayer} from '../player'
import search from "../services/search"

export default class DeleteCommand extends Command {
  static trigger = /^delete ([0-9]+)$/

  async handle() {
    const player = await getCurrentPlayer(this.guild.id)
    const position = parseInt(this.args[0], 10) - 1
    if (player.queue.length > position && position >= 0) {
      player.delete(position)
    }
    this.message.channel.send(player.currentlyPlaying ? player.currentlyPlaying.info.title : 'nothing is playin...??')
  }
}