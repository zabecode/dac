import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DevicesController = () => import('#controllers/devices_controller')
const SensorsController = () => import('#controllers/sensors_controller')

/**
 * DAC Inertia routes (frontend pages)
 * Protected by auth
 */
router
  .group(() => {
    router.get('/devices', [DevicesController, 'index']).as('pages.devices')
    router.get('/sensors', [SensorsController, 'index']).as('pages.sensors')
  })
  .middleware([middleware.auth(), middleware.superUser()])
