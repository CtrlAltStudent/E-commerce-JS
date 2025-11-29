exports.up = function(knex) {
  return knex.schema.createTable("reviews", table => {
    table.increments("id").primary();
    table.integer("product_id").unsigned().notNullable().references("id").inTable("products").onDelete("CASCADE");
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("SET NULL");
    table.integer("rating").notNullable().unsigned();
    table.text("comment");
    table.boolean("is_approved").defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("reviews");
};
