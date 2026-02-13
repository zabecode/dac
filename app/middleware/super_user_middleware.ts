import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SuperUserMiddleware {
  async handle({ auth, response, session }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user || !user.isSuperUser) {
      session.flash('errors', { authorization: 'Acesso restrito a Super Usuários.' })
      return response.redirect().toPath('/dashboard')
    }

    return next()
  }
}
