import './config'
import { Client } from 'discord.js'
import GuildService from './services/guild'
import { Command } from './commands/command'
import CommandsService from './services/commands'
import path from 'path'
import glob from 'glob'

const commands: typeof Command[] = []
const bot = new Client()
const commandsGlob = path.join(__dirname, 'commands')+'/**/*.command.ts'

glob(commandsGlob, (e, matches) => {
  for (const match of matches) {
    const command = require(match).default

    if (command.prototype instanceof Command) {
      commands.push(command)
    }
  }
})

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