const knex = require("../db/knex");

module.exports = {
  findByEmail: (email) => knex('users').where({ email }).first(),
  findById: (id) => knex('users').where({ id }).first(),
  create: async ({ email, password_hash, role_id = null, first_name = null, last_name = null }) => {
    const [user] = await knex('users').insert({
      email, password_hash, role_id, first_name, last_name
    }).returning('*');
    return user;
  },
  updatePassword: (id, password_hash) => knex('users').where({ id }).update({ password_hash }).returning('*')
};
