import type { HttpContext } from '@adonisjs/core/http'
import { ApiKeyService } from '#services/api_key_secure_service'
import { createApiKeySchema, updateApiKeySchema } from '#validators/api_key'
import vine from '@vinejs/vine'

export default class ApiKeysController {
  /**
   * GET /api-keys
   * Lista chaves do usuário + módulos disponíveis
   */
  async index({ inertia, auth, response, session }: HttpContext) {
    const user = auth.user!

    if (!user.isSuperUser) {
      session.flash('error', 'Apenas Membros do Sistema podem gerenciar API Keys.')
      return response.redirect().toPath('/dashboard')
    }

    const apiKeys = await ApiKeyService.listForUser(user.id)
    const modules = ApiKeyService.getSystemModules()

    return inertia.render('admin/api_keys/index', { apiKeys, modules })
  }

  /**
   * POST /api-keys
   * Cria nova chave de API
   */
  async store({ request, response, session, auth }: HttpContext) {
    if (!auth.user!.isSuperUser) {
      session.flash('error', 'Ação não permitida.')
      return response.redirect().back()
    }

    const payload = await vine.validate({
      schema: createApiKeySchema,
      data: request.all(),
    })

    const { rawKey } = await ApiKeyService.create({
      name: payload.name,
      identifier: payload.identifier,
      userId: auth.user!.id,
      expiresAt: payload.expiresAt || null,
      permissions: payload.permissions,
    })

    // Flash the raw key ONLY ONCE
    session.flash('newApiKey', rawKey)

    return response.redirect().back()
  }

  /**
   * PUT /api-keys/:id
   * Atualiza chave existente
   */
  async update({ params, request, response, auth, session }: HttpContext) {
    if (!auth.user!.isSuperUser) {
      session.flash('error', 'Ação não permitida.')
      return response.redirect().back()
    }

    const payload = await vine.validate({
      schema: updateApiKeySchema,
      data: request.all(),
    })

    const { default: ApiKey } = await import('#models/api_key')
    const apiKey = await ApiKey.findOrFail(params.id)

    await ApiKeyService.update(apiKey, {
      name: payload.name,
      identifier: payload.identifier,
      isActive: payload.isActive,
      expiresAt: payload.expiresAt !== undefined ? payload.expiresAt || null : undefined,
      permissions: payload.permissions,
    })

    session.flash('success', 'API key atualizada com sucesso')
    return response.redirect().back()
  }

  /**
   * DELETE /api-keys/:id
   * Revoga (deleta) chave
   */
  async destroy({ params, response, auth, session }: HttpContext) {
    if (!auth.user!.isSuperUser) {
      session.flash('error', 'Ação não permitida.')
      return response.redirect().back()
    }

    await ApiKeyService.revoke(params.id)

    session.flash('success', 'API key revogada com sucesso')
    return response.redirect().back()
  }
}
