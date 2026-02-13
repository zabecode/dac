import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()
      table.bigInteger('code').unsigned().unique().index().notNullable()

      // Kind: 'user' para pessoas, 'group' para grupos RBAC
      table.enum('kind', ['user', 'group']).notNullable().defaultTo('user')

      // Campos básicos (name é obrigatório para ambos)
      table.string('name', 120).notNullable()
      table.string('email', 254).nullable().unique()
      table.string('password').nullable()

      // Status e permissões
      table.boolean('is_enabled').notNullable().defaultTo(false)
      table.boolean('is_super_user').nullable().defaultTo(false)

      // Termos e verificações (apenas para users)
      table.boolean('accept_terms').nullable().defaultTo(false)
      table.datetime('accept_terms_at').nullable()
      table.datetime('email_verified_at').nullable()

      // Tracking de acesso (apenas para users)
      table.datetime('last_login_at').nullable()
      table.string('last_ip', 50).nullable()

      // Profile JSON para dados adicionais flexíveis
      table.json('profile').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
