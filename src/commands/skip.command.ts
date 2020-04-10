import { CashCommand } from './cash-command'
import { getCurrentPlayer, Player } from '../player'

export default class SkipCommand extends CashCommand {
  static trigger = /^((skip)|(next))$/

  cost = 420

  player!: Player
  async init () {
    this.player = await getCurrentPlayer(this.guild.id)
  }

  valid () {
    return this.player.queue.length > 0 || this.player.isPlaying
  }

  async handleCommand() {
    this.player.skip()
    this.message.channel.send(`that skip cost you \$${this.cost}, ${this.message.author.username}...`)
  }

}