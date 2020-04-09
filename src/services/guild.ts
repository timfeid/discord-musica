import {Guild as GuildEntity} from '../data/entities/guild'
import { Guild } from 'discord.js'

const guilds: Record<number, GuildEntity> = {}

const find = (id: number) => {
  return guilds[id]
}

const findOrCreate = async (guild: Guild) => {
  const id = parseInt(guild.id, 10)
  if (!guilds[id]) {
    guilds[id] = await GuildEntity.findOne({id}) || await GuildEntity.create({id, name: guild.name}).save()
  }

  return guilds[id]
}

export default {
  findOrCreate,
  find,
}