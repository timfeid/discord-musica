import { Command } from "./command"
import { Guild } from "../data/entities/guild"
import { Message } from "discord.js"

export default class TestCommand extends Command {
  static trigger = /^test$/

  async handle() {
    this.message.reply('testarino works')
  }
}