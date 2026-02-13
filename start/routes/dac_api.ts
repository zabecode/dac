import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DevicesApiController = () => import('#controllers/devices_api_controller')
const SensorsApiController = () => import('#controllers/sensors_api_controller')
const ReadingsApiController = () => import('#controllers/readings_api_controller')

/**
 * DAC API Routes — authenticated via API Key
 */
router
  .group(() => {
    // ==================== Devices ====================
    router.resource('devices', DevicesApiController).apiOnly()

    // ==================== Sensors ====================
    router.resource('sensors', SensorsApiController).apiOnly()

    // ==================== Readings ====================
    router.resource('readings', ReadingsApiController).apiOnly()

    // ==================== DAC Gateway ====================
    router
      .group(() => {
        router.post('devices/publish', [DevicesApiController, 'publish'])
        router.post('readings/batch', [ReadingsApiController, 'batchPublish'])
      })
      .prefix('dac')
  })
  .prefix('api/v1')
  .middleware(middleware.apiAuth())
