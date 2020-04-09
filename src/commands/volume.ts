import { Command } from "./command"
import { Guild } from "../data/entities/guild"
import { Message } from "discord.js"
import { getCurrentDispatcher } from "./play"

export default class VolumeCommand extends Command {
  static trigger = /^volume (1?[0-9]{1,2})$/

  async handle() {
    let volume = parseInt(this.args[0], 10)
    if (volume === NaN) {
      this.message.reply('mannn what u doin. enter a number between 0 and 100, ty')
      return
    }
    this.message.reply(`volume set to ${this.args[0]}, my dud`)

    this.guild.volume = volume
    await this.guild.save()

    const dispatcher = getCurrentDispatcher()
    if (dispatcher) {
      dispatcher.setVolumeLogarithmic(volume / 100)
    }
  }
}