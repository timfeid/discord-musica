import GuildService from '../../services/guild'
import UserService from '../../services/user'
import { Command } from "../command"
import { City } from '../../data/entities/city'

export default class CharacterCommand extends Command {
  static trigger = /^travel\s?(\S+)?$/
  static description = `show your currenty city or travel to a new city`
  static usage = 'travel <shortName>?'
  static example = 'travel vegas'

  async handle () {
    if (this.args[0]) {
      const cities = await City.find()
      const city = cities.find(city => city.shortName === this.args[0])

      if (city) {
        this.user.currentCity = city
        this.user.save()

        return this.message.channel.send(`${this.message.author.username}, you are now in ${this.user.currentCity.name}`)
      }

      this.respondConfused('please choose from one of the following')
      const message = cities.map(city => {
        return `- ${city.name} (${city.shortName})\n${city.description}`
      }).join('\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n')
      this.message.channel.send(`\`\`\`${message}\`\`\``)

    } else {
      this.message.channel.send(`you, ${this.message.author.username}, are in ${this.user.currentCity.name}`)
    }
  }
}