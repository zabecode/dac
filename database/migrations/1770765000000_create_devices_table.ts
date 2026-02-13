import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'devices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier', 150).notNullable().index()
      table.string('mac', 17).notNullable()
      table.string('last_ip', 45).nullable()
      table.boolean('active').defaultTo(true)
      table.string('description', 255).nullable()
      table.json('metadata').nullable()
      table.timestamp('last_connection_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['identifier', 'mac'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
