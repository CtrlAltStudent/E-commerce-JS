exports.up = async function(knex) {
  const has = await knex.schema.hasTable('users');
  if (!has) {
    // jeśli nie ma tabeli users - tworzymy prostą wersję (bez nadpisywania)
    return knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.integer('role_id').unsigned().nullable();
      table.timestamps(true, true);
    });
  }
  // jeśli tabela istnieje - dodaj kolumny tylko gdy ich brak
  const hasPassword = await knex.schema.hasColumn('users', 'password');
  if (!hasPassword) {
    await knex.schema.alterTable('users', table => {
      table.string('password').notNullable().defaultTo(''); // później zaktualizować
    });
  }
  const hasRoleId = await knex.schema.hasColumn('users', 'role_id');
  if (!hasRoleId) {
    await knex.schema.alterTable('users', table => {
      table.integer('role_id').unsigned().nullable();
    });
  }
};
exports.down = async function(knex) {
  const has = await knex.schema.hasTable('users');
  if (!has) return;
  const hasPassword = await knex.schema.hasColumn('users', 'password');
  if (hasPassword) {
    await knex.schema.alterTable('users', table => {
      table.dropColumn('password');
    });
  }
  const hasRoleId = await knex.schema.hasColumn('users', 'role_id');
  if (hasRoleId) {
    await knex.schema.alterTable('users', table => {
      table.dropColumn('role_id');
    });
  }
};
