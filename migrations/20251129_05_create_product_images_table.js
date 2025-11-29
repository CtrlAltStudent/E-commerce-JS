exports.up = function(knex) {
  return knex.schema.createTable("product_images", table => {
    table.increments("id").primary();
    table.integer("product_id").unsigned().notNullable().references("id").inTable("products").onDelete("CASCADE");
    table.string("url").notNullable();
    table.string("alt_text");
    table.integer("position").defaultTo(0);
    table.boolean("is_primary").defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("product_images");
};
