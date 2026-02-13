import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users_controller')

router
  .group(() => {
    // Admin-only management
    router
      .group(() => {
        router.resource('users', UsersController).only(['index', 'store', 'update', 'destroy'])
      })
      .middleware(middleware.admin())
  })
  .middleware([middleware.auth(), middleware.superUser()])

router
  .group(() => {
    router.get('settings/profile', [UsersController, 'profile']).as('settings.profile')
    router.put('settings/profile', [UsersController, 'updateProfile']).as('settings.profile.update')
  })
  .middleware([middleware.auth()])
