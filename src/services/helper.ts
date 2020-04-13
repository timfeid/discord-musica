import { User } from "../data/entities/user";
import { TextChannel, DMChannel, NewsChannel, User as DUser } from "discord.js";

export function randomNum(low: number, high: number) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

export function sendStats(channel: TextChannel | DMChannel | NewsChannel, user: DUser, mydude: User) {
  channel.send(`${user.username} \`\`\`\n rep: ${mydude.reputation.toFixed(2)}\nheat: ${mydude.heat}/100\ncash: \$${mydude.cash}\n\`\`\``)
}