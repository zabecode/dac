import logger from '@adonisjs/core/services/logger'

/**
 * Centralized helper for JSON column serialization/deserialization
 * Provides consistent error handling and logging across all models
 */
export const jsonColumn = {
  /**
   * Deserialize JSON from database
   */
  consume: (value: string | null | object): any => {
    if (!value) return {}

    try {
      return typeof value === 'string' ? JSON.parse(value) : value
    } catch (error) {
      logger.error({ error, value }, 'Failed to parse JSON column')
      return {}
    }
  },

  /**
   * Serialize JSON to database
   */
  prepare: (value: any): string | null => {
    if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
      return null
    }

    try {
      return JSON.stringify(value)
    } catch (error) {
      logger.error({ error, value }, 'Failed to stringify JSON column')
      return null
    }
  },

  /**
   * Keep as object for API serialization
   */
  serialize: (value: any): any => value,
}
