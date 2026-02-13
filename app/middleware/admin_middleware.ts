import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Admin middleware
 * Ensures the authenticated user has admin role
 */
export default class AdminMiddleware {
  async handle({ auth, response, inertia }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user) {
      return response.redirect().toRoute('auth.login')
    }

    if (!user.isSuperUser) {
      return inertia.render('errors/forbidden')
    }

    return await next()
  }
}
