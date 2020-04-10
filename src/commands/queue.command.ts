import { Command } from './command'
import { getCurrentPlayer } from '../player'

export default class QueueCommand extends Command {
  static trigger = /^q(ueue)?$/

  async handle() {
    const player = await getCurrentPlayer(this.guild.id)
    if (player.queue.length === 0) {
      return this.respondConfused('nothing in dat q')
    }
    this.message.channel.send(player.queue.map((queue, i) => `${i+1}. ${queue.info.title}`).join('\n'))
  }

}