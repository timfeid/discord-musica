import './config'
import { Client } from 'discord.js'
import GuildService from './services/guild'
import { Command } from './commands/command'
import TestCommand from './commands/test'
import PlayCommand from './commands/play'
import CommandsService from './services/commands'
import VolumeCommand from './commands/volume'
import SkipCommand from './commands/skip'
import QueueCommand from './commands/queue'

const commands: typeof Command[] = [
  TestCommand,
  PlayCommand,
  VolumeCommand,
  SkipCommand,
  QueueCommand,
]
const bot = new Client()

bot.once('ready', async () => {
  bot.guilds.cache.forEach(async guild => {
    await GuildService.findOrCreate(guild)
  })
})

bot.once('disconnect', () => {
  console.log('Disconnect!')
})

bot.on('message', async message => {
  for (const command of commands) {
    if (await CommandsService.applysTo(command, message) && message.guild) {
      const guild = await GuildService.findOrCreate(message.guild)
      // @ts-ignore
      let handler = new command(guild, message, command.trigger)
      await handler.handle()
    }
  }
})

export {bot}