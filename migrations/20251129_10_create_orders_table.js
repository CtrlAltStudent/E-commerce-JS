exports.up = function(knex) {
  return knex.schema.createTable("orders", table => {
    table.increments("id").primary();
    table.string("order_number").notNullable().unique();
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("SET NULL");
    table.integer("address_id").unsigned().references("id").inTable("addresses").onDelete("SET NULL");
    table.decimal("subtotal", 12, 2).notNullable().defaultTo(0);
    table.decimal("shipping", 12, 2).defaultTo(0);
    table.decimal("tax", 12, 2).defaultTo(0);
    table.decimal("total", 12, 2).notNullable().defaultTo(0);
    table.string("status").notNullable().defaultTo("pending");
    table.timestamp("placed_at").defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("orders");
};
