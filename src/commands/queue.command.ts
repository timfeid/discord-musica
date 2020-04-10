import { Command } from './command'
import { getCurrentPlayer } from '../player'

export default class QueueCommand extends Command {
  static trigger = /^q(ueue)?$/

  async handle() {
    const player = await getCurrentPlayer(this.guild.id)
    if (player.queue.length === 0) {
      this.message.channel.send('eloff... stop trying to break shit. nothing in dat q')

      return
    }
    this.message.channel.send(player.queue.map((queue, i) => `${i+1}. ${queue.info.title}`).join('\n'))
  }

}