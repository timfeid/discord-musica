import GuildService from '../../services/guild'
import UserService from '../../services/user'
import { Command } from "../command"

export default class CashCommand extends Command {
  static trigger = /^rep\s?(\S+)?$/
  async handle () {
    if (this.args[0]) {
      const user = await GuildService.findUserByMention(this.message.guild!, this.args[0])
      if (user) {
        const mydude = await UserService.findOrCreate(user.user)
        this.message.channel.send(`${user.user.username} has a rep of ${mydude.reputation.toFixed(2)}`)
      } else {
        this.respondConfused()
      }
    } else {
      this.message.channel.send(`you, ${this.message.author.username}, have a rep of ${this.user.reputation.toFixed(2)}`)
    }
  }
}