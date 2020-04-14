import { CashCommand } from './cash-command'
import { getCurrentPlayer, Player } from '../player'

export default class DeleteCommand extends CashCommand {
  static trigger = /^del(ete)? ([0-9]+)$/

  cost = 420

  player!: Player
  position!: number

  async init() {
    this.player = await getCurrentPlayer(this.guild.id)
    this.position = parseInt(this.args[this.args.length === 1 ? 0 : 1], 10) - 1
  }

  isValid() {
    return this.player.queue.length > 0 && this.position < this.player.queue.length
  }

  async handleCommand() {
    this.message.channel.send(`deleted ${this.player.queue[this.position].info.title}... you were charged \$${this.cost} for doin that`)
    this.player.delete(this.position)
  }

}