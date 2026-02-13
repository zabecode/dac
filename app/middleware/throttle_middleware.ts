import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import redis from '@adonisjs/redis/services/main'

/**
 * Throttle Middleware
 * Rate limits requests based on API key or IP address
 */
export default class ThrottleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { max: number; window: number } = { max: 60, window: 60 }
  ) {
    const { max = 60, window = 60 } = options // 60 req/min por padrão

    // Usar API key prefix como identificador se disponível, senão IP
    const apiKey = ctx.params.apiKey
    const identifier = apiKey?.prefix || ctx.request.ip()
    const key = `throttle:${identifier}`

    const current = await redis.incr(key)

    // Set expiration on first request
    if (current === 1) {
      await redis.expire(key, window)
    }

    // Check if limit exceeded
    if (current > max) {
      const ttl = await redis.ttl(key)
      return ctx.response.tooManyRequests({
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${ttl} seconds.`,
        retryAfter: ttl,
      })
    }

    // Add rate limit headers
    ctx.response.header('X-RateLimit-Limit', max.toString())
    ctx.response.header('X-RateLimit-Remaining', (max - current).toString())
    ctx.response.header(
      'X-RateLimit-Reset',
      (Math.floor(Date.now() / 1000) + (await redis.ttl(key))).toString()
    )

    await next()
  }
}
