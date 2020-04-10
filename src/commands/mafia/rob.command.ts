import { Command } from "../command"
import GuildService from '../../services/guild'
import UserService from '../../services/user'
import { randomNum } from "../../services/helper"
import { User } from "../../data/entities/user"
import { CrimeCommand, CrimeResponse } from "./crime-command"

const lastRobs: Record<string, Record<number, Date>> = {}
const COOLDOWN_TIME_IN_MINUTES = 5
const INCREASED_REP_FOR_ROBBING = .2
const INCREASED_REP_FOR_COUNTERING = .3

export default class RobCommand extends CrimeCommand {
  static trigger = /^rob ([\S]+)$/

  caughtChanceOutOf100 = 5
  heatIncrease = 0.5
  jailTimeInMinutes = 2

  async handleCrime () {
    let robeeGuildMember = await GuildService.findUserByMention(this.message.guild!, this.args[0])
    if (robeeGuildMember && robeeGuildMember!.user.id !== this.message.author.id) {
      const robee = await UserService.findOrCreate(robeeGuildMember.user)
      const robeeName = robeeGuildMember.user.username
      const cooldown = this.onCooldown(robee)

      if (!cooldown) {
        return await this.rob(robee, robeeName)
      } else {
        this.message.channel.send(`mannnn, ${robeeName} is still recovering from the last robbery. please wait ${cooldown}s`)
      }
    } else {
      this.respondConfused()
    }

    return {increaseHeat: false}
  }

  onCooldown (robee: User) {
    if (!lastRobs[this.user.id]) {
      lastRobs[this.user.id] = {}
    }

    if (lastRobs[this.user.id] && lastRobs[this.user.id][robee.id]) {
      const timeCheck = new Date()
      const currentTime = new Date().getTime()
      timeCheck.setTime(lastRobs[this.user.id][robee.id].getTime() + COOLDOWN_TIME_IN_MINUTES * 60000)
      const checkTime = timeCheck.getTime()
      if (currentTime < checkTime) {
        return Math.ceil((checkTime - currentTime)/1000)
      }
    }

    lastRobs[this.user.id][robee.id] = new Date()

    return false
  }

  async updateUserBasedOnResults(winner: User, loser: User, cashFlow: number, rep: number) {
    winner.reputation += rep
    winner.cash += cashFlow
    loser.reputation -= rep
    loser.cash -= cashFlow
    await Promise.all([loser.save(), winner.save()])
  }

  async rob (robee: User, robeeName: string): Promise<CrimeResponse> {
    let increaseHeat = false
    const userName = this.message.author.username

    if (randomNum(0, this.user.reputation) > randomNum(0, robee.reputation)) {
      const total = randomNum(1, robee.cash < 200 ? robee.cash : 200)
      this.updateUserBasedOnResults(this.user, robee, total, INCREASED_REP_FOR_ROBBING)
      this.message.channel.send(`ohhhh shit! ${userName} robbed \$${total} from ${robeeName}`)
      increaseHeat = true

    } else if (randomNum(1,3) === 3) {
      const total = randomNum(1, this.user.cash < 200 ? this.user.cash : 200)
      this.updateUserBasedOnResults(robee, this.user, total, INCREASED_REP_FOR_COUNTERING)
      this.message.channel.send(`rippppp ${userName} tried to rob ${robeeName}, but ${robeeName} ended up robbing ${userName} for \$${total} instead`)

    } else {
      this.message.channel.send(`mannn, ${robeeName} just bitch slapped ${userName}. you aint take shit`)
    }


    return {increaseHeat}
  }
}