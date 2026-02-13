import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('request_count')
      table.dropColumn('last_request_reset_at')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('request_count').defaultTo(0)
      table.timestamp('last_request_reset_at').nullable()
    })
  }
}
