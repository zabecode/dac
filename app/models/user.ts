import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, afterSave, afterDelete } from '@adonisjs/lucid/orm'
import BroadcastService from '#services/broadcast_service'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import ApiKey from '#models/api_key'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export interface ProfileInterface {
  avatar?: string
  phone?: string
  bio?: string
  preferences?: Record<string, any>
  [key: string]: any
}

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: number

  @column()
  declare kind: 'user' | 'group'

  @column()
  declare name: string

  @column()
  declare email: string | null

  @column({ serializeAs: null })
  declare password: string | null

  @column({
    columnName: 'is_enabled',
    consume: (value) => Boolean(value),
    prepare: (value) => Boolean(value),
  })
  declare isEnabled: boolean

  @column({
    columnName: 'is_super_user',
    serializeAs: 'isSuperUser',
    consume: (value) => value === 1 || value === true || String(value) === '1',
    prepare: (value) => (value ? 1 : 0),
  })
  declare isSuperUser: boolean

  @column({
    consume: (value) => Boolean(value),
    prepare: (value) => Boolean(value),
  })
  declare acceptTerms: boolean | null

  @column.dateTime({ columnName: 'accept_terms_at' })
  declare acceptTermsAt: DateTime | null

  @column.dateTime({ columnName: 'last_login_at' })
  declare lastLoginAt: DateTime | null

  @column.dateTime({ columnName: 'email_verified_at' })
  declare emailVerifiedAt: DateTime | null

  @column({ columnName: 'last_ip' })
  declare lastIp: string | null

  @column({
    prepare: (value: ProfileInterface) => JSON.stringify(value || {}),
    consume: (value: any) => (typeof value === 'string' ? JSON.parse(value) : value || {}),
  })
  declare profile: ProfileInterface

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasMany(() => ApiKey, {
    foreignKey: 'userId',
  })
  declare apiKeys: HasMany<typeof ApiKey>

  get isUser(): boolean {
    return this.kind === 'user'
  }

  get isGroup(): boolean {
    return this.kind === 'group'
  }

  get canLogin(): boolean {
    return this.isUser && !!this.email && !!this.password
  }

  get initials(): string {
    return this.name
      .split(' ')
      .map((n) => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  @afterSave()
  @afterDelete()
  static async broadcastUpdate() {
    await BroadcastService.refreshDashboard()
  }
}
