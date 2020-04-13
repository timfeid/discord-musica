import { Command } from "../command"
import GuildService from '../../services/guild'
import UserService from '../../services/user'
import { randomNum } from "../../services/helper"
import { User } from "../../data/entities/user"
import { CrimeCommand, CrimeResponse } from "./crime-command"

const lastRobs: Record<string, Date> = {}
const COOLDOWN_TIME_IN_MINUTES = 1440

export default class RobBankCommand extends CrimeCommand {
  static trigger = /^bankrob$/

  caughtChancePercentage = 80
  heatIncrease = 50
  jailTimeInMinutes = 10
  repIncrease = 30

  async handleCrime () {
    const total = randomNum(5000, 15000)
    this.message.channel.send(`ohhhh shit! ${this.message.author.username} robbed \$${total} from the bank!!`)
    return {
      increaseHeat: true,
      increaseRep: true,
      increaseCash: total,
    }
  }

  sendCooldownMessage (cooldown: number) {
    this.message.channel.send(`${this.message.author.username} you should chill the fuck out. please wait ${cooldown}s`)
  }

  getCooldown () {
    if (lastRobs[this.user.id]) {
      const timeCheck = new Date()
      const currentTime = new Date().getTime()
      timeCheck.setTime(lastRobs[this.user.id].getTime() + COOLDOWN_TIME_IN_MINUTES * 60000)
      const checkTime = timeCheck.getTime()
      if (currentTime < checkTime) {
        return Math.ceil((checkTime - currentTime)/1000)
      }
    }

    lastRobs[this.user.id] = new Date()

    return false
  }
}