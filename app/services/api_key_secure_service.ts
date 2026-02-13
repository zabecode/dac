import string from '@adonisjs/core/helpers/string'
import hash from '@adonisjs/core/services/hash'
import ApiKey from '#models/api_key'
import { GlobalService } from '#services/global_service'
import { systemModules } from '../../config/modules.js'
import { DateTime } from 'luxon'

interface CreateApiKeyData {
  name: string
  identifier: string
  userId: number
  expiresAt?: string | null
  permissions: string[]
}

interface UpdateApiKeyData {
  name?: string
  identifier?: string
  isActive?: boolean
  expiresAt?: string | null
  permissions?: string[]
}

export class ApiKeyService {
  /**
   * Generates a new API key and its hash
   */
  static async generateKeyPair(): Promise<{ key: string; hash: string; prefix: string }> {
    const key = string.random(40)
    const prefix = key.slice(0, 8)
    const keyHash = await hash.make(key)
    return { key, hash: keyHash, prefix }
  }

  /**
   * Parses a date string into a Luxon DateTime, or returns null
   */
  private static parseDate(value: string | null | undefined): DateTime | null {
    if (!value) return null
    const dt = DateTime.fromISO(value)
    if (dt.isValid) return dt
    const dt2 = DateTime.fromJSDate(new Date(value))
    return dt2.isValid ? dt2 : null
  }

  /**
   * Creates a new API key with all required fields
   * Returns both the ApiKey record and the raw key (shown only once)
   */
  static async create(data: CreateApiKeyData): Promise<{ apiKey: ApiKey; rawKey: string }> {
    const { key, hash: keyHash, prefix } = await this.generateKeyPair()

    const apiKey = await ApiKey.create({
      code: GlobalService.generationCode(),
      name: data.name,
      identifier: data.identifier,
      prefix,
      keyHash,
      userId: data.userId,
      isActive: true,
      expiresAt: this.parseDate(data.expiresAt),
      permissions: data.permissions,
    })

    return { apiKey, rawKey: key }
  }

  /**
   * Updates an existing API key
   */
  static async update(apiKey: ApiKey, data: UpdateApiKeyData): Promise<ApiKey> {
    if (data.name !== undefined) apiKey.name = data.name
    if (data.identifier !== undefined) apiKey.identifier = data.identifier
    if (data.isActive !== undefined) apiKey.isActive = data.isActive
    if (data.permissions !== undefined) apiKey.permissions = data.permissions
    if (data.expiresAt !== undefined) {
      apiKey.expiresAt = this.parseDate(data.expiresAt)
    }

    await apiKey.save()
    return apiKey
  }

  /**
   * Validates a raw API key string
   * Checks: exists, hash matches, active, not expired
   * Returns the ApiKey with user preloaded, or null
   */
  static async validateKey(rawKey: string): Promise<ApiKey | null> {
    const prefix = rawKey.slice(0, 8)

    const apiKey = await ApiKey.query()
      .where('prefix', prefix)
      .where('isActive', true)
      .preload('user')
      .first()

    if (!apiKey) return null

    // Verify full key hash
    const isValid = await hash.verify(apiKey.keyHash, rawKey)
    if (!isValid) return null

    // Check expiration
    if (apiKey.isExpired) return null

    // Update last used
    apiKey.lastUsedAt = DateTime.now()
    await apiKey.save()

    return apiKey
  }

  /**
   * Lists all API keys for a user
   */
  static async listForUser(userId: number): Promise<ApiKey[]> {
    return ApiKey.query().where('userId', userId).orderBy('createdAt', 'desc')
  }

  /**
   * Revokes (deletes) an API key
   */
  static async revoke(apiKeyId: number): Promise<void> {
    const apiKey = await ApiKey.findOrFail(apiKeyId)
    await apiKey.delete()
  }

  /**
   * Returns the list of system modules for permissions UI
   */
  static getSystemModules() {
    return systemModules
  }
}
