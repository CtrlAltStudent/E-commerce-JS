const knex = require('../db/knex');

/**
 * Build category tree from flat list
 */
async function getTree() {
  const categories = await knex('categories')
    .select('id', 'name', 'description', 'parent_id')
    .orderBy('name');

  const map = {};
  const tree = [];

  categories.forEach(cat => {
    map[cat.id] = { ...cat, children: [] };
  });

  categories.forEach(cat => {
    if (cat.parent_id) {
      map[cat.parent_id]?.children.push(map[cat.id]);
    } else {
      tree.push(map[cat.id]);
    }
  });

  return tree;
}

module.exports = {
  findAll(opts = {}) {
    const query = knex('categories')
      .select('id', 'name', 'description', 'parent_id', 'created_at', 'updated_at')
      .orderBy('id', 'asc');

    if (opts.limit) query.limit(Number(opts.limit));
    if (opts.offset) query.offset(Number(opts.offset));

    return query;
  },

  findById(id) {
    return knex('categories').where({ id }).first();
  },

  create({ name, description, parent_id = null }) {
    return knex('categories')
      .insert({ name, description, parent_id })
      .returning('*')
      .then(r => r[0]);
  },

  update(id, data) {
    return knex('categories')
      .where({ id })
      .update({
        ...data,
        updated_at: knex.fn.now()
      })
      .returning('*')
      .then(r => r[0]);
  },

  remove(id) {
    return knex('categories').where({ id }).del();
  },

  getTree
};
