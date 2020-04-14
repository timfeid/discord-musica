import { Command } from "../command"
import { randomNum, sendStats } from "../../services/helper"
import { User } from "../../data/entities/user"

const RESET_HEAT_TO = 1
const JAIL_LOST_REP = 10

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
    if ((await this.init()) !== false) {
      if (await this.isValid()) {
        if (!this.isInJail()) {
          const cooldown = await this.getCooldown()
          if (!cooldown) {
            if(!this.putInJail()) {
              const response = await this.handleCrime()
              response.increaseHeat && this.saveIncreasedHeat()
              response.increaseRep && this.saveIncreasedRep()
              response.increaseCash && this.saveIncreasedCash(response.increaseCash)
              this.sendInfo()
              this.user.save()
              this.createCooldown()
            }
          } else {
            this.sendCooldownMessage(cooldown)
          }
        }
      } else {
        this.respondConfused()
      }
    }
  }

  isValid (): boolean | Promise<boolean> {return true}
  init (): boolean | void | Promise<boolean | void> {}

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

  async addSentence (user?: User) {
    const u = user ? user : this.user
    const date = new Date()
    date.setMinutes(new Date().getMinutes() + this.jailTimeInMinutes)
    u.outOfJailAt = date
    u.reputation = u.reputation < JAIL_LOST_REP ? 0 : u.reputation - JAIL_LOST_REP
    await u.save()
  }

  sendInfo () {
    sendStats(this.message.channel, this.message.author, this.user)
  }

  abstract getCooldown (): false | number | Promise<false | number>

  sendCooldownMessage (seconds: number) {}
  createCooldown () {
  }

  putInJail () {
    if (randomNum(1, 100) <= (this.caughtChancePercentage - this.user.reputation + this.user.heat)) {
      this.addSentence()
      this.jailMessage()
      return true
    }

    return false
  }

  jailMessage () {
    this.message.channel.send(`:police_officer: ah shit the police!! you were caught doin da crime, therefore, you doin da time! you in jail for ${this.jailTimeInMinutes} minutes`)
  }

  abstract handleCrime (): CrimeResponse | Promise<CrimeResponse>
}