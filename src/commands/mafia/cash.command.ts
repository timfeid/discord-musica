import GuildService from '../../services/guild'
import UserService from '../../services/user'
import { Command } from "../command"
import { sendStats } from '../../services/helper'

export default class CashCommand extends Command {
  static trigger = /^cash\s?(\S+)?$/
  async handle () {
    if (this.args[0]) {
      const user = await GuildService.findUserByMention(this.message.guild!, this.args[0])
      if (user) {
        const mydude = await UserService.findOrCreate(user.user)
        sendStats(this.message.channel, user.user, mydude)
      } else {
        this.respondConfused()
      }
    } else {
      sendStats(this.message.channel, this.message.author, this.user)
    }
  }
}