import type { HttpContext } from '@adonisjs/core/http'
import { ReadingService } from '#services/reading_service'

export default class ReadingsApiController {
  /**
   * GET /api/v1/readings
   */
  async index(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('readings')) {
      return ctx.response.forbidden({ error: 'No permission for readings' })
    }
    const readings = await ReadingService.list((ctx as any).apiKeyIdentifier, {
      sensorId: ctx.request.input('sensorId') ? Number(ctx.request.input('sensorId')) : undefined,
      limit: ctx.request.input('limit') ? Number(ctx.request.input('limit')) : undefined,
      orderBy: ctx.request.input('orderBy'),
      orderDirection: ctx.request.input('orderDirection'),
    })
    return ctx.response.ok(readings)
  }

  /**
   * GET /api/v1/readings/:id
   */
  async show(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('readings')) {
      return ctx.response.forbidden({ error: 'No permission for readings' })
    }
    const reading = await ReadingService.get(ctx.params.id, (ctx as any).apiKeyIdentifier)
    return ctx.response.ok(reading)
  }

  /**
   * POST /api/v1/readings
   */
  async store(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('readings')) {
      return ctx.response.forbidden({ error: 'No permission for readings' })
    }
    const reading = await ReadingService.create((ctx as any).apiKeyIdentifier, ctx.request.body())
    return ctx.response.created(reading)
  }

  /**
   * PUT /api/v1/readings/:id
   */
  async update(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('readings')) {
      return ctx.response.forbidden({ error: 'No permission for readings' })
    }
    const reading = await ReadingService.update(
      ctx.params.id,
      (ctx as any).apiKeyIdentifier,
      ctx.request.body()
    )
    return ctx.response.ok(reading)
  }

  /**
   * DELETE /api/v1/readings/:id
   */
  async destroy(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('readings')) {
      return ctx.response.forbidden({ error: 'No permission for readings' })
    }
    await ReadingService.delete(ctx.params.id, (ctx as any).apiKeyIdentifier)
    return ctx.response.noContent()
  }

  /**
   * POST /api/v1/dac/readings/batch
   * Batch publish readings from gateway
   */
  async batchPublish(ctx: HttpContext) {
    const apiKey = (ctx as any).apiKey
    if (!apiKey.hasPermission('readings')) {
      return ctx.response.forbidden({ error: 'No permission for readings' })
    }
    const { readings } = ctx.request.body()
    const results = await ReadingService.batchPublish((ctx as any).apiKeyIdentifier, readings || [])
    return ctx.response.ok(results)
  }
}
