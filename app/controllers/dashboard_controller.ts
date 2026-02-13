import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import ApiKey from '#models/api_key'
import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  /**
   * Render Dashboard with basic stats
   */
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    // Base stats
    const [totalUsers, totalApiKeys, totalClients] = await Promise.all([
      user.isSuperUser
        ? User.query().where('kind', 'user').count('* as total')
        : Promise.resolve([{ $extras: { total: 0 } }]),

      user.isSuperUser
        ? ApiKey.query().count('* as total')
        : Promise.resolve([{ $extras: { total: 0 } }]),

      user.isSuperUser
        ? db.from('api_keys').countDistinct('identifier as total').where('identifier', '!=', '')
        : Promise.resolve([{ total: 0 }]),
    ])

    return inertia.render('dashboard', {
      stats: {
        users: {
          value: totalUsers[0].$extras.total,
          limit: null,
        },
        apiKeys: {
          value: totalApiKeys[0].$extras.total,
          limit: null,
        },
        clients: {
          value: totalClients[0].total || 0,
          limit: null,
        },
      },
    })
  }
}
