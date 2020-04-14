import { randomNum } from "../../services/helper"
import { CrimeCommand } from "./crime-command"
import GuildService from '../../services/guild'
import { User } from "discord.js"
import { User as UserEntity } from '../../data/entities/user'
import UserService from '../../services/user'

type Heist = {
  userIds: string[]
  joined: string[]
  users: User[]
  players: UserEntity[]
}

const lastRobs: Record<string, Date> = {}
const COOLDOWN_TIME_IN_MINUTES = 1440
const currentHeists: Heist[] = []

const getCurrentHeist = (id: string) => {
  return currentHeists.find(h => !!h.userIds.find(i => i === id))
}

export default class HeistCommand extends CrimeCommand {
  static trigger = /^heist\s?(.*?)$/

  caughtChancePercentage = 85
  heatIncrease = 25
  jailTimeInMinutes = 10
  repIncrease = 7

  currentHeist?: Heist
  heistTotalPeople!: number

  async init () {
    const cooldown = await this.getCooldown()
    if (cooldown) {
      return
    }
    this.currentHeist = getCurrentHeist(this.message.author.id)
    if (this.args[0]) {
      if (!!this.currentHeist) {
        this.message.channel.send('man, you are already in a heist.')
        return false
      }
      const hello = this.args[0].split(' ')
      const users = [this.message.author]
      const players = [this.user]
      if (!this.message.guild) {
        this.message.channel.send('please... only in a server channel. thanx')
        return false
      }
      await Promise.all(hello.map(async mention => {
        const user = await GuildService.findUserByMention(this.message.guild!, mention)
        if (user) {
          const player = await UserService.findOrCreate(user!.user)
          users.push(user.user)
          if (!players.find(p => p.id === player.id)) {

            players.push(player)
          }
        } else {
          console.log(mention)
        }
      }))

      // console.log(users.length, hello)
      if (players.length !== hello.length + 1) {
        this.respondConfused('could not find dem playas')
        return false
      }

      currentHeists.push({
        users,
        userIds: users.map(p => p.id),
        joined: [this.message.author.id],
        players,
      })

      this.message.channel.send(`oooo, ${this.message.author.username} started a heist with ${users.map(p => p.username).join(', ')}. everyone needs to type \`${this.guild.prefix}heist\` to join`)
      return false
    } else if (this.currentHeist) {
      if (this.currentHeist.joined.includes(this.message.author.id)) {
        this.respondConfused('you are already in da heist')
        return false
      }

      this.currentHeist.joined.push(this.message.author.id)
      if (this.currentHeist.joined.length !== this.currentHeist.userIds.length) {
        this.message.channel.send(`${this.message.author.username} has joined the heist!`)
        return false
      }
      this.heistTotalPeople = this.currentHeist.joined.length

      this.currentHeist.players.forEach(player => {
        this.caughtChancePercentage -= player.reputation + player.heat
      })
    }

    // return !!heist && heist.joined.length === heist.userIds.length
  }

  isValid (): boolean | Promise<boolean> {
    if (!!this.currentHeist) {
      currentHeists.splice(currentHeists.findIndex(heist => heist == this.currentHeist!), 1)
      return true
    }

    if (this.getCooldown()) {
      return true
    }

    return false
  }

  sendInfo () {}

  async handleCrime () {
    const total = randomNum(5000, 15000)
    this.message.channel.send(`ohhhh shit! ${this.currentHeist!.users.map(u => u.username).join(', ')} robbed \$${total * this.heistTotalPeople} from the bank!!`)

    this.currentHeist!.players.forEach(player => {
      player.cash += total
      player.reputation += this.repIncrease
      player.heat += this.heatIncrease
      player.save()

      lastRobs[player.id] = new Date()
    })

    return {}
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

    return false
  }

  putInJail () {
    const response = super.putInJail()
    if (response) {
      for (const user of this.currentHeist!.players) {
        if (user.id !== this.user.id) {
          this.addSentence(user)
        }
      }

    }

    return response
  }

  jailMessage () {
    this.message.channel.send(`:police_car: ah shit yall got caught!!! everyone is in jail for ${this.jailTimeInMinutes} minutes (${this.caughtChancePercentage}% chance)`)
  }
}