const knex = require('../db/knex');

module.exports = {
  /**
   * Get all categories
   */
  findAll: (opts = {}) => {
    const query = knex('categories')
      .select('id', 'name', 'description', 'created_at', 'updated_at')
      .orderBy('id', 'asc');

    if (opts.limit) {
      query.limit(Number(opts.limit));
    }

    if (opts.offset) {
      query.offset(Number(opts.offset));
    }

    return query;
  },

  /**
   * Get category by id
   */
  findById: (id) => {
    return knex('categories')
      .where({ id })
      .first();
  },

  /**
   * Create category
   */
  create: async ({ name, description }) => {
    const [row] = await knex('categories')
      .insert({
        name,
        description
      })
      .returning('*');

    return row;
  },

  /**
   * Update category
   */
  update: async (id, { name, description }) => {
    const [row] = await knex('categories')
      .where({ id })
      .update(
        {
          name,
          description,
          updated_at: knex.fn.now()
        }
      )
      .returning('*');

    return row;
  },

  /**
   * Delete category
   */
  remove: async (id) => {
    return knex('categories')
      .where({ id })
      .del();
  }
};
