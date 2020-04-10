import { Command } from "./command"

export abstract class CashCommand extends Command {
  abstract cost: number

  async handle () {
    await this.init()
    if (await this.isValid()) {
      if (this.hasEnoughCash()) {
        this.handleCommand()
      } else {
        this.notEnoughtCashResponse()
      }
    } else {
      this.respondConfused()
    }
  }

  isValid (): boolean | Promise<boolean> {return true}
  init () {}

  abstract handleCommand(): void

  hasEnoughCash () {
    const hasEnough = this.user.cash > this.cost
    if (hasEnough) {
      this.user.cash -= this.cost
      this.user.save()
    }

    return hasEnough
  }

  notEnoughtCashResponse() {
    this.message.channel.send('???? you broke man')
  }



}