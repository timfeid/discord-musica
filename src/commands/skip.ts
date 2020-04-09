import { Command } from './command'
import { getCurrentPlayer } from '../player'

export default class SkipCommand extends Command {
  static trigger = /^skip$/

  async handle() {
    const player = await getCurrentPlayer(this.guild.id)
    player.skip()
  }

}