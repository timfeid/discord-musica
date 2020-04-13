import { createConnection, getConnection } from 'typeorm'
import { bot } from './discord'
import config from './config'
import {resolve} from 'path'
import { User } from './data/entities/user'

const decreaseHeat = async () => {
  console.log('decreasing heats')
  await getConnection().query('update user set heat = case when heat-3 > 0 then heat-3 else heat = 0 end')
}

createConnection({
  type: 'sqlite',
  database: config.database.file,
  synchronize: true,
  entities: [
    resolve(__dirname, './data/entities/*.ts')
  ],
}).then(() => {
  bot.login(process.env.DISCORD_TOKEN)
  setTimeout(decreaseHeat, 300000)
})