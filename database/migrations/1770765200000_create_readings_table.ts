import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'readings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('unique_id').nullable().index()
      table.string('identifier', 150).notNullable().index()
      table.integer('sensor_id').unsigned().references('id').inTable('sensors').onDelete('CASCADE')
      table.string('entry', 20).notNullable().defaultTo('manual')
      table.string('kind', 20).notNullable().defaultTo('unique')
      table.json('value').nullable()
      table.boolean('opened').defaultTo(false)
      table.string('grouping', 50).nullable()
      table.timestamp('datetime').notNullable()
      table.timestamp('opened_at').nullable()
      table.timestamp('closed_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
