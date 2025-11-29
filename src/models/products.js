// src/models/products.js
const knex = require('../db/knex');

module.exports = {
  findAll: async (opts = {}) => {
    const q = knex('products')
      .select('id','sku','name','description','price','stock','is_active','created_at','updated_at');

    if (opts.limit) q.limit(opts.limit);
    if (opts.offset) q.offset(opts.offset);

    return q;
  },

  findById: async (id) => {
    return knex('products').where({ id }).first();
  },

  create: async (data) => {
    const toInsert = {
      sku: data.sku || null,
      name: data.name,
      description: data.description || null,
      price: data.price ?? 0,
      stock: data.stock ?? 0,
      is_active: data.is_active ?? true,
      metadata: data.metadata || null
    };

    const inserted = await knex('products')
      .insert(toInsert)
      .returning('*');

    return inserted[0];
  },

  update: async (id, data) => {
    const allowed = ['sku','name','description','price','stock','is_active','metadata'];
    const toUpdate = {};

    allowed.forEach(key => {
      if (key in data) toUpdate[key] = data[key];
    });

    if (Object.keys(toUpdate).length === 0) return null;

    const updated = await knex('products')
      .where({ id })
      .update(toUpdate)
      .returning('*');

    return updated[0];
  },

  remove: async (id) => {
    return knex('products').where({ id }).del();
  }
};
