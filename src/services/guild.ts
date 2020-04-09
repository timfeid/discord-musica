import {Guild as GuildEntity} from '../data/entities/guild'
import { Guild } from 'discord.js'

const guilds: Record<string, GuildEntity> = {}


const findOrCreate = async (guild: Guild) => {
  if (!guilds[guild.id]) {
    const id = parseInt(guild.id, 10)
    guilds[guild.id] = await GuildEntity.findOne({id}) || await GuildEntity.create({id, name: guild.name}).save()
  }

  return guilds[guild.id]
}

export default {
  findOrCreate
}