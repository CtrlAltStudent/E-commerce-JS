exports.up = function (knex) {
  return knex.schema.table('categories', table => {
    table.boolean('is_active').notNullable().defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.table('categories', table => {
    table.dropColumn('is_active');
  });
};
