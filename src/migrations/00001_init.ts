import Knex from 'knex';

const addPrimaryId = (table: Knex.TableBuilder): void => {
  table
    .string('id', 64)
    .notNullable()
    .primary();
};

const addPrimaryIdReference = (table: Knex.TableBuilder) => {
  return (column: string, referenceTable: string): void => {
    table
      .string(column, 64)
      .notNullable()
      .references('id')
      .inTable(referenceTable)
      .onDelete('CASCADE');
  };
};

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('users', table => {
    addPrimaryId(table);
    table.string('minecraftAccountId').notNullable();
    table
      .decimal('credits')
      .defaultTo(0)
      .notNullable();
  });

  await knex.schema.createTable('servers', table => {
    addPrimaryId(table);
    table.boolean('isOnline');
    table.dateTime('creation');
  });

  await knex.schema.createTable('sessions', table => {
    addPrimaryIdReference(table)('userId', 'users');
    addPrimaryIdReference(table)('serverId', 'servers');
    table.dateTime('time').notNullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('sessions');
  await knex.schema.dropTableIfExists('servers');
  await knex.schema.dropTableIfExists('users');
};
