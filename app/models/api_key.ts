import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

/**
 * ApiKey Model - Chaves de API para autenticação externa
 *
 * Cada chave possui:
 * - code: identificador numérico único (obrigatório)
 * - expiresAt: data de expiração (opcional)
 * - permissions: array de slugs de módulos permitidos
 */
export default class ApiKey extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: number

  @column()
  declare identifier: string

  @column()
  declare name: string

  @column()
  declare prefix: string

  @column()
  declare keyHash: string

  @column()
  declare userId: number

  @column.dateTime()
  declare lastUsedAt: DateTime | null

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column({
    consume: (value: any) => Boolean(value),
    prepare: (value: any) => Boolean(value),
    serialize: (value: any) => Boolean(value),
  })
  declare isActive: boolean

  @column({
    prepare: (value: string[]) => JSON.stringify(value || []),
    consume: (value: any) => {
      if (!value) return []
      return typeof value === 'string' ? JSON.parse(value) : value
    },
  })
  declare permissions: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== Relacionamentos ====================

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  // ==================== Helpers ====================

  /**
   * Verifica se a API key está expirada
   */
  get isExpired(): boolean {
    if (!this.expiresAt) return false
    return this.expiresAt < DateTime.now()
  }

  /**
   * Verifica se a API key é válida (ativa e não expirada)
   */
  get isValid(): boolean {
    return this.isActive && !this.isExpired
  }

  /**
   * Verifica se a API key tem permissão para acessar um módulo
   */
  hasPermission(moduleSlug: string): boolean {
    if (!this.permissions || this.permissions.length === 0) return false
    return this.permissions.includes(moduleSlug)
  }
}
