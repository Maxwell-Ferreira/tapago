import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'charges'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .integer('person_id')
        .unsigned()
        .references('id')
        .inTable('people')
        .after('user_id')
        .notNullable()
      table.decimal('amount').notNullable().after('description')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('person_id')
      table.dropColumn('person_id')
      table.dropColumn('amount')
    })
  }
}
