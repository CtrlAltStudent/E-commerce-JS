const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL || {
    host: "127.0.0.1",
    port: 5432,
    user: "shop_user",
    password: "shop_pass",
    database: "shop_db"
  },
  pool: { min: 0, max: 10 }
});
module.exports = knex;
