import type { HttpContext } from '@adonisjs/core/http'
import { DeviceService } from '#services/device_service'

export default class DevicesApiController {
  /**
   * GET /api/v1/devices
   */
  async index(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('devices')) {
      return ctx.response.forbidden({ error: 'No permission for devices' })
    }
    const devices = await DeviceService.list((ctx as any).apiKeyIdentifier)
    return ctx.response.ok(devices)
  }

  /**
   * GET /api/v1/devices/:id
   */
  async show(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('devices')) {
      return ctx.response.forbidden({ error: 'No permission for devices' })
    }
    const device = await DeviceService.get(ctx.params.id, (ctx as any).apiKeyIdentifier)
    return ctx.response.ok(device)
  }

  /**
   * POST /api/v1/devices
   */
  async store(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('devices')) {
      return ctx.response.forbidden({ error: 'No permission for devices' })
    }
    const device = await DeviceService.create((ctx as any).apiKeyIdentifier, ctx.request.body())
    return ctx.response.created(device)
  }

  /**
   * PUT /api/v1/devices/:id
   */
  async update(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('devices')) {
      return ctx.response.forbidden({ error: 'No permission for devices' })
    }
    const device = await DeviceService.update(
      ctx.params.id,
      (ctx as any).apiKeyIdentifier,
      ctx.request.body()
    )
    return ctx.response.ok(device)
  }

  /**
   * DELETE /api/v1/devices/:id
   */
  async destroy(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('devices')) {
      return ctx.response.forbidden({ error: 'No permission for devices' })
    }
    await DeviceService.delete(ctx.params.id, (ctx as any).apiKeyIdentifier)
    return ctx.response.noContent()
  }

  /**
   * POST /api/v1/dac/devices/publish
   * Batch upsert device + sensors from gateway
   */
  async publish(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('devices')) {
      return ctx.response.forbidden({ error: 'No permission for devices' })
    }
    const device = await DeviceService.publishDevice(
      (ctx as any).apiKeyIdentifier,
      ctx.request.body()
    )
    return ctx.response.ok({ success: true, deviceId: device.id })
  }
}
