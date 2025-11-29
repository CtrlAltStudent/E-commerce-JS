exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.integer("role_id").unsigned().references("id").inTable("roles").onDelete("SET NULL");
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.string("first_name");
    table.string("last_name");
    table.string("phone");
    table.boolean("is_active").defaultTo(true);
    table.timestamp("last_login");
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
