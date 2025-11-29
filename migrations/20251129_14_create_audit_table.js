exports.up = function(knex) {
  return knex.schema.createTable("audit_logs", table => {
    table.increments("id").primary();
    table.string("action").notNullable();
    table.string("entity").notNullable();
    table.integer("entity_id").unsigned();
    table.integer("user_id").unsigned();
    table.jsonb("payload");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("audit_logs");
};
