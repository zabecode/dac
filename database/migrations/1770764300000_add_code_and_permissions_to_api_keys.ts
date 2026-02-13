import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'api_keys'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger('code').unsigned().notNullable().unique().after('id')
      table.json('permissions').nullable().after('expires_at')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('code')
      table.dropColumn('permissions')
    })
  }
}
