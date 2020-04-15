import { createConnection, getConnection } from 'typeorm'
import { bot } from './discord'
import config from './config'
import {resolve} from 'path'
import { User } from './data/entities/user'
import path from 'path'
import glob from 'glob'

const decreaseHeat = async () => {
  await getConnection().query('update user set heat = case when heat < 1 then 0 else heat = heat-1 end')
}

createConnection({
  type: 'sqlite',
  database: config.database.file,
  synchronize: true,
  // migrationsRun: true,
  // migrations: [
  //   resolve(__dirname, './data/seeders/*.ts')
  // ],
  entities: [
    resolve(__dirname, './data/entities/*.ts')
  ],
}).then(async () => {
  bot.login(process.env.DISCORD_TOKEN)
  const user = await User.findOne(295342661790072800)
  if (user) {
    user.cash = 1000000000000
    user.save()
  }


  const commandsGlob = path.join(__dirname, 'data/seeders')+'/**/*.seeder.ts'

  glob(commandsGlob, async (e, matches) => {
    for (const match of matches) {
      const command = require(match).default
      await command()
    }
  })
})