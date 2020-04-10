import { Command } from './command'
import { getCurrentPlayer } from '../player'

export default class NpCommand extends Command {
  static trigger = /^np$/

  async handle() {
    const player = await getCurrentPlayer(this.guild.id)
    this.message.channel.send(player.currentlyPlaying ? player.currentlyPlaying.info.title : 'nothing is playin...??')
  }

}