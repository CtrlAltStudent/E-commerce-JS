exports.up = function(knex) {
  return knex.schema.createTable("addresses", table => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("label");
    table.string("street").notNullable();
    table.string("city").notNullable();
    table.string("postal_code").notNullable();
    table.string("country").notNullable().defaultTo("PL");
    table.string("province");
    table.boolean("is_default").defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("addresses");
};
