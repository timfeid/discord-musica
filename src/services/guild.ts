import {Guild as GuildEntity} from '../data/entities/guild'
import { Guild, GuildMember } from 'discord.js'

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

const findUserByMention = async (guild: Guild, mention: string) => {
  const members = await guild.members.fetch()
  let method = (member: GuildMember) => member.user.username === mention
  if (mention.startsWith('<@!')) {
    method = (member: GuildMember) => member.id === mention.substr(3, mention.length-4)
  }

  const member = members.find(method)
  // if (member?.user.bot) {
  //   return
  // }

  return member
}

export default {
  findUserByMention,
  findOrCreate,
  find,
}