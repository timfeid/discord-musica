import {User as UserEntity} from '../data/entities/user'
import { Guild, User } from 'discord.js'

const findOrCreate = async (user: User) => {
  const id = parseInt(user.id, 10)
  return await UserEntity.findOne({id}) || await UserEntity.create({id}).save()
}

export default {
  findOrCreate,
}