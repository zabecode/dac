import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { ApiKeyService } from '#services/api_key_secure_service'

/**
 * API Auth Middleware
 *
 * Valida chave de API via Bearer token.
 * Verifica: existência, hash, ativo, expiração.
 *
 * Carrega no contexto:
 * - ctx.apiKey: instância da ApiKey validada
 * - ctx.apiKeyIdentifier: identificador do proprietário (client, company, etc.)
 *   → Usado para escopar dados pertencentes ao identificador
 */
export default class ApiAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.unauthorized({ error: 'Missing API Key' })
    }

    const rawKey = authHeader.replace('Bearer ', '')

    const apiKey = await ApiKeyService.validateKey(rawKey)

    if (!apiKey) {
      return ctx.response.unauthorized({ error: 'Invalid or expired API Key' })
    }

    // Load into request context
    ;(ctx as any).apiKey = apiKey
    ;(ctx as any).apiKeyIdentifier = apiKey.identifier

    await next()
  }
}
