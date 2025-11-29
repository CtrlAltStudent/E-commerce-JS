exports.up = function(knex) {
  return knex.schema.createTable("order_items", table => {
    table.increments("id").primary();
    table.integer("order_id").unsigned().notNullable().references("id").inTable("orders").onDelete("CASCADE");
    table.integer("product_id").unsigned().references("id").inTable("products").onDelete("SET NULL");
    table.integer("quantity").notNullable().defaultTo(1);
    table.decimal("unit_price", 12, 2).notNullable();
    table.decimal("line_total", 12, 2).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("order_items");
};
