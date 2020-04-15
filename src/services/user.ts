import {User as UserEntity} from '../data/entities/user'
import { Guild, User } from 'discord.js'
import { City } from '../data/entities/city'

const randomCity = async () => {
  return City.createQueryBuilder().orderBy('random()').getOne() || new City
}

const findOrCreate = async (user: User) => {
  const id = parseInt(user.id, 10)
  let u = await UserEntity.findOne(id) || await UserEntity.create({id, currentCity: await randomCity()}).save()

  return u
}

export default {
  findOrCreate,
}