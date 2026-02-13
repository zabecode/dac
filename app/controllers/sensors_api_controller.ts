import type { HttpContext } from '@adonisjs/core/http'
import { SensorService } from '#services/sensor_service'

export default class SensorsApiController {
  /**
   * GET /api/v1/sensors
   */
  async index(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('sensors')) {
      return ctx.response.forbidden({ error: 'No permission for sensors' })
    }
    const deviceId = ctx.request.input('deviceId')
    const sensors = await SensorService.list(
      (ctx as any).apiKeyIdentifier,
      deviceId ? Number(deviceId) : undefined
    )
    return ctx.response.ok(sensors)
  }

  /**
   * GET /api/v1/sensors/:id
   */
  async show(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('sensors')) {
      return ctx.response.forbidden({ error: 'No permission for sensors' })
    }
    const sensor = await SensorService.get(ctx.params.id, (ctx as any).apiKeyIdentifier)
    return ctx.response.ok(sensor)
  }

  /**
   * POST /api/v1/sensors
   */
  async store(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('sensors')) {
      return ctx.response.forbidden({ error: 'No permission for sensors' })
    }
    const sensor = await SensorService.create((ctx as any).apiKeyIdentifier, ctx.request.body())
    return ctx.response.created(sensor)
  }

  /**
   * PUT /api/v1/sensors/:id
   */
  async update(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('sensors')) {
      return ctx.response.forbidden({ error: 'No permission for sensors' })
    }
    const sensor = await SensorService.update(
      ctx.params.id,
      (ctx as any).apiKeyIdentifier,
      ctx.request.body()
    )
    return ctx.response.ok(sensor)
  }

  /**
   * DELETE /api/v1/sensors/:id
   */
  async destroy(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('sensors')) {
      return ctx.response.forbidden({ error: 'No permission for sensors' })
    }
    await SensorService.delete(ctx.params.id, (ctx as any).apiKeyIdentifier)
    return ctx.response.noContent()
  }
}
