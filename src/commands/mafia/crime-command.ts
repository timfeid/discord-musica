import { Command } from "../command"
import { randomNum } from "../../services/helper"

const RESET_HEAT_TO = 2

export type CrimeResponse = {
  increaseHeat?: boolean
  increaseRep?: boolean
  increaseCash?: number
}

export abstract class CrimeCommand extends Command {
  abstract caughtChancePercentage: number
  abstract heatIncrease: number
  abstract jailTimeInMinutes: number
  abstract repIncrease: number

  async handle () {
    await this.init()
    if (await this.isValid()) {
      if (!this.isInJail() && !this.putInJail()) {
        const cooldown = await this.getCooldown()
        if (!cooldown) {
          const response = await this.handleCrime()
          response.increaseHeat && this.saveIncreasedHeat()
          response.increaseRep && this.saveIncreasedRep()
          response.increaseCash && this.saveIncreasedCash(response.increaseCash)
          this.sendInfo()
          this.user.save()
        } else {
          this.sendCooldownMessage(cooldown)
        }
      }
    } else {
      this.respondConfused()
    }
  }

  isValid (): boolean | Promise<boolean> {return true}
  init () {}

  saveIncreasedHeat () {
    this.user.heat += this.heatIncrease
  }

  saveIncreasedRep () {
    this.user.reputation += this.repIncrease
  }

  saveIncreasedCash (cash: number) {
    this.user.cash += cash
  }

  isInJail() {
    if (this.user.outOfJailAt) {
      const getOutOfJailTime = this.user.outOfJailAt.getTime()
      const now = new Date().getTime()
      if (getOutOfJailTime > now) {
        const timeleft = Math.ceil((getOutOfJailTime - now) / 1000)
        this.message.channel.send(`dude, you can't do that from jail... you still have ${timeleft}s left on your sentence`)
        return true
      }

      this.removeSentence()
    }

    return false
  }

  async removeSentence () {
    this.user.heat = RESET_HEAT_TO
    this.user.outOfJailAt = null
    await this.user.save()
  }

  async addSentence () {
    const date = new Date()
    date.setMinutes(new Date().getMinutes() + this.jailTimeInMinutes)
    this.user.outOfJailAt = date
    await this.user.save()
  }

  sendInfo () {
    this.message.channel.send(`your new stats \`\`\`
 rep: ${this.user.reputation.toFixed(2)}
heat: ${this.user.heat}/100
cash: \$${this.user.cash}
\`\`\``)
  }

  abstract getCooldown (): false | number | Promise<false | number>

  sendCooldownMessage (seconds: number) {}

  putInJail () {
    if (randomNum(1, 100) <= (this.caughtChancePercentage + this.user.heat)) {
      this.addSentence()
      this.jailMessage()
      return true
    }

    return false
  }

  jailMessage () {
    this.message.channel.send(`:police_officer: ah shit the police!! you were caught trying doin crime, therefore, you gotta do the time! you in jail for ${this.jailTimeInMinutes} minutes`)
  }

  abstract handleCrime (): CrimeResponse | Promise<CrimeResponse>
}