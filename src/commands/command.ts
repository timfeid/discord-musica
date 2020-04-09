import { Guild } from "../data/entities/guild"
import { Message } from "discord.js"

export abstract class Command {
  static trigger: RegExp

  protected message: Message
  protected guild: Guild
  protected args: string[]

  constructor(guild: Guild, message: Message, trigger: RegExp) {
    this.guild = guild
    this.message = message
    this.args = message.content.substr(guild.prefix.length).match(trigger)!.slice(1)
  }

  public abstract handle(): void

  get voiceChannel () {
    return this.message.member?.voice.channel
  }
}
