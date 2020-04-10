import { Command } from "./command"
import { Guild } from "../data/entities/guild"
import { Message } from "discord.js"
import { getCurrentPlayer } from "../player"

export default class VolumeCommand extends Command {
  static trigger = /^v(olume)? (1?[0-9]{1,2})$/

  async handle() {
    let volume = parseInt(this.args[this.args.length === 2 ? 1 : 0], 10)
    if (volume === NaN) {
      this.message.channel.send('mannn what u doin. enter a number between 0 and 100, ty')
      return
    }
    this.message.channel.send(`volume set to ${volume}, my dud`)

    this.guild.volume = volume
    await this.guild.save()

    const player = await getCurrentPlayer(this.guild.id)
    player.setVolume(volume)
  }
}