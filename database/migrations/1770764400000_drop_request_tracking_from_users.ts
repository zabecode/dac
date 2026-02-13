import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    // Use raw SQL to safely drop columns that may not exist
    const hasRequestCount = await this.schema.hasColumn(this.tableName, 'request_count')
    if (hasRequestCount) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('request_count')
      })
    }

    const hasLastRequestResetAt = await this.schema.hasColumn(
      this.tableName,
      'last_request_reset_at'
    )
    if (hasLastRequestResetAt) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('last_request_reset_at')
      })
    }
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('request_count').defaultTo(0)
      table.timestamp('last_request_reset_at').nullable()
    })
  }
}
