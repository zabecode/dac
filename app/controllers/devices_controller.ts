import type { HttpContext } from '@adonisjs/core/http'
import Device from '#models/device'

export default class DevicesController {
  async index({ inertia }: HttpContext) {
    const devices = await Device.query().preload('sensors').orderBy('createdAt', 'desc')

    return inertia.render('devices/index', {
      devices: devices.map((d) => d.serialize()),
    })
  }
}
