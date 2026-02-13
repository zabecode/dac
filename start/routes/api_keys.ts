import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ApiKeysController = () => import('#controllers/api_keys_controller')

router
  .group(() => {
    router.get('/api-keys', [ApiKeysController, 'index']).as('api_keys.index')
    router.post('/api-keys', [ApiKeysController, 'store']).as('api_keys.store')
    router.put('/api-keys/:id', [ApiKeysController, 'update']).as('api_keys.update')
    router.delete('/api-keys/:id', [ApiKeysController, 'destroy']).as('api_keys.destroy')
  })
  .middleware([middleware.auth(), middleware.superUser()])
