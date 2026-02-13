import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Add indexes to api_keys table
    this.schema.alterTable('api_keys', (table) => {
      // table.index('user_id') // Redundant with FK
      table.index(['user_id', 'is_active'])
    })
  }

  async down() {
    // MySQL quirk: Cannot drop index 'api_keys_user_id_is_active_index' because it's needed in a FK constraint.
    // Since the api_keys table will be dropped in its own migration rollback (1770610100000),
    // we can safely skip dropping this index here to avoid blocking the rollback process.
  }
}
