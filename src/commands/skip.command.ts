import { Command } from './command'
import { getCurrentPlayer } from '../player'

const COST = 100

export default class SkipCommand extends Command {
  static trigger = /^((skip)|(next))$/

  async handle() {
    const player = await getCurrentPlayer(this.guild.id)

    if (player.queue.length > 0 || player.isPlaying) {
      if (this.user.cash > COST) {
        this.user.cash -= COST
        await this.user.save()
        player.skip()
        this.message.channel.send(`that cost you \$${COST}, ${this.message.author.username}...`)
      } else {
        this.message.channel.send(`you dun have enuf $$$ to do that. jukebox cost \$${COST} to skip. you only gots \$${this.user.cash}`)
      }
    } else {
      this.message.channel.send('got nothin in the q ??')
    }
  }

}