import { BaseCommand } from '@adonisjs/core/ace'
import User from '#models/user'

export default class CheckUser extends BaseCommand {
  static commandName = 'check:users'

  async run() {
    const users = await User.all()
    this.logger.info('Listing all users:')
    for (const user of users) {
      this.logger.info(
        `Email: ${user.email} | isSuperUser: ${user.isSuperUser} (Raw: ${user.$attributes.isSuperUser}) | Kind: ${user.kind}`
      )
    }
  }
}
