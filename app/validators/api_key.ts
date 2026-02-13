import vine from '@vinejs/vine'

/**
 * Validação para criação de API Key
 */
export const createApiKeySchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(100),
  identifier: vine.string().trim().minLength(2).maxLength(150),
  expiresAt: vine.string().optional().nullable(),
  permissions: vine.array(vine.string().trim()).minLength(1),
})

/**
 * Validação para atualização de API Key
 */
export const updateApiKeySchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(100).optional(),
  identifier: vine.string().trim().minLength(2).maxLength(150).optional(),
  isActive: vine.boolean().optional(),
  expiresAt: vine.string().optional().nullable(),
  permissions: vine.array(vine.string().trim()).minLength(1).optional(),
})
