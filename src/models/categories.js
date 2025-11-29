const knex = require("../db/knex");

module.exports = {
  findAll: (opts = {}) => {
    const q = knex('categories').select('*').orderBy('name');
    if (opts.limit) q.limit(opts.limit);
    if (opts.offset) q.offset(opts.offset);
    return q;
  },

  findById: (id) => knex('categories').where({ id }).first(),

  findBySlug: (slug) => knex('categories').where({ slug }).first(),

  create: async ({ name, slug, description }) => {
    const [row] = await knex('categories').insert({ name, slug, description }).returning('*');
    return row;
  },

  update: async (id, data) => {
    const [row] = await knex('categories').where({ id }).update(data).returning('*');
    return row;
  },

  remove: (id) => knex('categories').where({ id }).del()
};
