import { Message } from 'discord.js'
import { Command } from '../commands/command'
import GuildService from './guild'

const applysTo = async (command: typeof Command, message: Message) => {
  if (message.guild) {
    const guild = await GuildService.findOrCreate(message.guild)

    return message.content.length > guild.prefix.length
      && message.content.startsWith(guild.prefix)
      && command.trigger.test(message.content.substr(guild.prefix.length))
  }
}

export default {
  applysTo
}