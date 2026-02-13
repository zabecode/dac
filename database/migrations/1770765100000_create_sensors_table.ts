import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sensors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('identifier', 150).notNullable().index()
      table.integer('device_id').unsigned().references('id').inTable('devices').onDelete('CASCADE')
      table.integer('code').notNullable()
      table.string('name', 100).notNullable()
      table.string('description', 180).nullable()
      table.boolean('active').defaultTo(true)
      table.string('kind', 30).notNullable().defaultTo('custom')
      table.json('metadata').nullable()
      table.timestamp('last_connection_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['identifier', 'device_id', 'code'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
