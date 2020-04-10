import { Guild } from "../data/entities/guild"
import { Message } from "discord.js"
import { User } from "../data/entities/user"
import { randomNum } from "../services/helper"

export type CommandArgs = {
  guild: Guild
  message: Message
  trigger: RegExp
  user: User
}

export abstract class Command {
  static trigger: RegExp

  protected message: Message
  protected guild: Guild
  protected args: string[]
  protected user: User

  constructor({guild, message, trigger, user}: CommandArgs) {
    this.guild = guild
    this.message = message
    this.user = user
    this.args = message.content.substr(guild.prefix.length).match(trigger)!.slice(1)
  }

  public abstract handle(): void

  get voiceChannel () {
    return this.message.member?.voice.channel
  }

  respondConfused (extra = '') {
    const random = [
      'dafux u doin eloff??',
      'stop tryin to break shit, eloff',
      'what the fuck u tryin to do?!?',
    ]

    this.message.channel.send(`${random[randomNum(0, random.length-1)]} ${extra}`)
  }
}
