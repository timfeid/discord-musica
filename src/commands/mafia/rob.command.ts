import {GuildMember} from 'discord.js'
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

  caughtChancePercentage = 15
  heatIncrease = 0.5
  jailTimeInMinutes = 1
  repIncrease = 0 // we are handling it below, since it varies

  robeeGuildMember?: GuildMember
  robee?: User

  async initCrime () {
    this.robeeGuildMember = await GuildService.findUserByMention(this.message.guild!, this.args[0])
    if (this.robeeGuildMember) {
      this.robee = await UserService.findOrCreate(this.robeeGuildMember!.user)
    }
  }

  async isValidCrime () {
    return this.robeeGuildMember !== undefined && this.robeeGuildMember!.user.id !== this.message.author.id
  }

  async sendCooldownMessage (cooldown: number) {
    const robeeName = this.robeeGuildMember!.user.username
    this.message.channel.send(`mannnn, ${robeeName} is still recovering from the last robbery. please wait ${cooldown}s`)
  }

  async getCooldown () {
    if (!lastRobs[this.user.id]) {
      lastRobs[this.user.id] = {}
    }

    if (lastRobs[this.user.id] && lastRobs[this.user.id][this.robee!.id]) {
      const timeCheck = new Date()
      const currentTime = new Date().getTime()
      timeCheck.setTime(lastRobs[this.user.id][this.robee!.id].getTime() + COOLDOWN_TIME_IN_MINUTES * 60000)
      const checkTime = timeCheck.getTime()
      if (currentTime < checkTime) {
        return Math.ceil((checkTime - currentTime)/1000)
      }
    }

    lastRobs[this.user.id][this.robee!.id] = new Date()

    return false
  }

  async updateUserBasedOnResults(winner: User, loser: User, cashFlow: number, rep: number) {
    winner.reputation += rep
    winner.cash += cashFlow
    loser.reputation -= rep
    loser.cash -= cashFlow
    await Promise.all([loser.save(), winner.save()])
  }

  async handleCrime () {
    const robeeName = this.robeeGuildMember!.user.username

    const userName = this.message.author.username

    if (randomNum(0, this.user.reputation) > randomNum(0, this.robee!.reputation)) {
      const total = randomNum(1, this.robee!.cash < 200 ? this.robee!.cash : 200)
      this.updateUserBasedOnResults(this.user, this.robee!, total, INCREASED_REP_FOR_ROBBING)
      this.message.channel.send(`ohhhh shit! ${userName} robbed \$${total} from ${robeeName}`)
      return {increaseHeat: true}

    } else if (randomNum(1,3) === 3) {
      const total = randomNum(1, this.user.cash < 200 ? this.user.cash : 200)
      this.updateUserBasedOnResults(this.robee!, this.user, total, INCREASED_REP_FOR_COUNTERING)
      this.message.channel.send(`rippppp ${userName} tried to rob ${robeeName}, but ${robeeName} ended up robbing ${userName} for \$${total} instead`)

    } else {
      this.message.channel.send(`mannn, ${robeeName} just bitch slapped ${userName}. you aint take shit`)
    }

    return {}
  }

}