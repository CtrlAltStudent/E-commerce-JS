exports.up = function(knex) {
  return knex.schema.createTable("products", table => {
    table.increments("id").primary();
    table.string("sku").unique();
    table.string("name").notNullable();
    table.text("description");
    table.decimal("price", 12, 2).notNullable();
    table.integer("stock").notNullable().defaultTo(0);
    table.boolean("is_active").defaultTo(true);
    table.jsonb("metadata");
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("products");
};
