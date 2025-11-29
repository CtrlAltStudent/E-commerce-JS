exports.up = function(knex) {
  return knex.schema.createTable("carts", table => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.decimal("total", 12, 2).defaultTo(0);
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("carts");
};
