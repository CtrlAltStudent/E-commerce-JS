// src/db/knex.js
const path = require('path');
const config = require(path.resolve(__dirname, '../../knexfile.js'));

const env = process.env.NODE_ENV || 'development';
const knex = require('knex')(config[env]);

module.exports = knex;
