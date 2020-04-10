import { Command } from './command'
import { getCurrentPlayer } from '../player'

export default class QueueCommand extends Command {
  static trigger = /^queue$/

  async handle() {
    const player = await getCurrentPlayer(this.guild.id)
    this.message.channel.send(player.queue.map((queue, i) => `${i+1}. ${queue.info.title}`).join('\n'))
  }

}