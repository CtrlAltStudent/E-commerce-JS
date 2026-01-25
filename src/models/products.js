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
        'promo_price',
        'promo_from',
        'promo_to',
        'stock',
        'is_active',
        'category_id',
        'created_at',
        'updated_at'
      );

    // domyślnie frontend (sklep) widzi tylko aktywne
    if (!opts.includeInactive) {
      q.where('is_active', true);
    }

    // filtr kategorii
    const categoryId = opts.category_id || opts.category;
    if (categoryId) {
      q.where('category_id', categoryId);
    }

    // 🔒 STABILNA KOLEJNOŚĆ (KLUCZ DO PROBLEMU)
    q.orderBy([
      { column: 'created_at', order: 'asc' }
    ]);

    // paginacja
    if (opts.limit) q.limit(Number(opts.limit));
    if (opts.offset) q.offset(Number(opts.offset));

    // pobranie danych
    const rows = await q;

    const now = new Date();

    // logika promocji
    return rows.map(p => {
      const isPromo =
        p.promo_price &&
        (!p.promo_from || new Date(p.promo_from) <= now) &&
        (!p.promo_to || new Date(p.promo_to) >= now);

      return {
        ...p,
        is_promo: Boolean(isPromo),
        final_price: isPromo ? p.promo_price : p.price
      };
    });
},


  async findById(id) {
    const p = await knex('products')
      .where({
        id,
        is_active: true
      })
      .first();

    if (!p) return null;

    const now = new Date();

    const isPromo =
      p.promo_price &&
      (!p.promo_from || new Date(p.promo_from) <= now) &&
      (!p.promo_to || new Date(p.promo_to) >= now);

    return {
      ...p,
      is_promo: isPromo,
      final_price: isPromo ? p.promo_price : p.price
    };
  },

  async create(data) {
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
      promo_price: data.promo_price || null,
      promo_from: data.promo_from || null,
      promo_to: data.promo_to || null,
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
      'promo_price',
      'promo_from',
      'promo_to',
      'stock',
      'is_active',
      'metadata',
      'category_id'
    ];

    const toUpdate = {};
    for (const key of allowed) {
      if (key in data) toUpdate[key] = data[key];
    }

    if (Object.keys(toUpdate).length === 0) return null;

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
  },

  async findNewest(limit = 5) {
    return knex('products')
      .where({ is_active: true })
      .orderBy('created_at', 'desc')
      .limit(limit);
  }
};
