import { CashCommand } from './cash-command'
import { getCurrentPlayer, Player } from '../player'

export default class VolumeCommand extends CashCommand {
  static trigger = /^v(olume)? (1?[0-9]{1,2})$/

  cost = 50

  player!: Player
  volume!: number

  async init() {
    this.volume = parseInt(this.args[this.args.length === 2 ? 1 : 0], 10)
  }

  valid() {
    return this.volume !== NaN
  }

  async handleCommand() {
    this.message.channel.send(`volume set to ${this.volume}, my dud. that skip cost you \$${this.cost}`)

    this.guild.volume = this.volume
    await this.guild.save()

    const player = await getCurrentPlayer(this.guild.id)
    player.setVolume(this.volume)
  }

}