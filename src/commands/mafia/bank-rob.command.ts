import { randomNum } from "../../services/helper"
import { CrimeCommand } from "./crime-command"

const lastRobs: Record<string, Date> = {}
const COOLDOWN_TIME_IN_MINUTES = 25

export default class RobBankCommand extends CrimeCommand {
  static trigger = /^bankrob$/

  caughtChancePercentage = 85
  heatIncrease = 25
  jailTimeInMinutes = 10
  repIncrease = 5

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

  createCooldown () {
    lastRobs[this.user.id] = new Date()
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

    return false
  }
}