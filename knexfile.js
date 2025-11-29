require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://shop_user:shop_pass@localhost:5432/shop_db',
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
