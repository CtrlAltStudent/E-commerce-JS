exports.up = function(knex) {
  return knex.schema.createTable("payments", table => {
    table.increments("id").primary();
    table.integer("order_id").unsigned().notNullable().references("id").inTable("orders").onDelete("CASCADE");
    table.string("provider");
    table.string("provider_payment_id").unique();
    table.string("status").notNullable().defaultTo("pending");
    table.decimal("amount", 12, 2).notNullable();
    table.timestamp("paid_at");
    table.jsonb("meta");
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("payments");
};
