import type { HttpContext } from '@adonisjs/core/http'
import Sensor from '#models/sensor'

export default class SensorsController {
  async index({ inertia }: HttpContext) {
    const sensors = await Sensor.query().preload('device').orderBy('createdAt', 'desc')

    return inertia.render('sensors/index', {
      sensors: sensors.map((s) => s.serialize()),
    })
  }
}
