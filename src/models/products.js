// src/models/products.js
const knex = require('../db/knex');

module.exports = {
  async findAll(opts = {}) {
    const q = knex('products')
      .select(
        'id',
        'sku',
        'name',
        'description',
        'price',
        'stock',
        'is_active',
        'category_id',
        'created_at',
        'updated_at'
      );

    const categoryId = opts.category_id || opts.category;

    if (categoryId) {
      q.where('category_id', categoryId);
    }



    if (opts.limit) q.limit(Number(opts.limit));
    if (opts.offset) q.offset(Number(opts.offset));

    return q;
  },

  async findById(id) {
    return knex('products').where({ id }).first();
  },

  async create(data) {
    // 🔒 sprawdzenie kategorii
    const category = await knex('categories')
      .where({ id: data.category_id })
      .first();

    if (!category) {
      throw new Error('Category does not exist');
    }

    const toInsert = {
      sku: data.sku || null,
      name: data.name,
      description: data.description || null,
      price: data.price,
      stock: data.stock ?? 0,
      is_active: data.is_active ?? true,
      metadata: data.metadata || null,
      category_id: data.category_id
    };

    const [row] = await knex('products')
      .insert(toInsert)
      .returning('*');

    return row;
  },

  async update(id, data) {
    const allowed = [
      'sku',
      'name',
      'description',
      'price',
      'stock',
      'is_active',
      'metadata',
      'category_id'
    ];

    const toUpdate = {};

    for (const key of allowed) {
      if (key in data) {
        toUpdate[key] = data[key];
      }
    }

    if (Object.keys(toUpdate).length === 0) {
      return null;
    }

    // 🔒 jeśli zmieniana kategoria – sprawdź czy istnieje
    if (toUpdate.category_id) {
      const category = await knex('categories')
        .where({ id: toUpdate.category_id })
        .first();

      if (!category) {
        throw new Error('Category does not exist');
      }
    }

    const [row] = await knex('products')
      .where({ id })
      .update(toUpdate)
      .returning('*');

    return row;
  },

  async remove(id) {
    return knex('products').where({ id }).del();
  }
};
