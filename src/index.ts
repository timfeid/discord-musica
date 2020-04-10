import { createConnection } from 'typeorm'
import { bot } from './discord'
import config from './config'
import {resolve} from 'path'

createConnection({
  type: 'sqlite',
  database: config.database.file,
  synchronize: true,
  entities: [
    resolve(__dirname, './data/entities/*.ts')
  ],
}).then(() => {
  bot.login(process.env.DISCORD_TOKEN)
})