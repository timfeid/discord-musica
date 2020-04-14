import { createConnection, getConnection } from 'typeorm'
import { bot } from './discord'
import config from './config'
import {resolve} from 'path'
import { User } from './data/entities/user'
import user from './services/user'

const decreaseHeat = async () => {
  await getConnection().query('update user set heat = case when heat < 1 then 0 else heat = heat-1 end')
}

createConnection({
  type: 'sqlite',
  database: config.database.file,
  synchronize: true,
  entities: [
    resolve(__dirname, './data/entities/*.ts')
  ],
}).then(async () => {
  bot.login(process.env.DISCORD_TOKEN)
  const user = await User.findOne(295342661790072800)
  user.cash = 1000000000000
  user.save()
})