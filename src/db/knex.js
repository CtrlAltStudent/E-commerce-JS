const knexConfig = require('../../knexfile'); // zakładamy, że knexfile.js istnieje w repo root
const env = process.env.NODE_ENV || 'development';
const config = knexConfig[env] || knexConfig.development;
const knex = require('knex')(config);
module.exports = knex;
