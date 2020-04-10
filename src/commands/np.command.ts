import { Command } from './command'
import { getCurrentPlayer } from '../player'

export default class NpCommand extends Command {
  static trigger = /^np$/

  async handle() {
    const player = await getCurrentPlayer(this.guild.id)
    if (!player.currentlyPlaying) {
      this.respondConfused()
    }

    this.message.channel.send(player.currentlyPlaying!.info.title)
  }

}