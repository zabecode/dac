import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class InertiaShareMiddleware {
  async handle({ inertia, auth }: HttpContext, next: NextFn) {
    try {
      await auth.check()
    } catch (e) {
      // User not logged in, ignore
    }

    const user = auth.user

    inertia.share({
      auth: {
        user: user
          ? {
              id: user.id,
              code: user.code,
              fullName: user.name,
              email: user.email,
              kind: user.kind,
              isSuperUser: Boolean(user.isSuperUser),
              role: user.isSuperUser ? 'admin' : 'user',
            }
          : null,
      },
      // Current system flash messages
      flash: (ctx: HttpContext) => ctx.session.flashMessages.all(),
    })

    return next()
  }
}
