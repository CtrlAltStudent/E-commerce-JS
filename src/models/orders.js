const knex = require('../db/knex');

function generateOrderNumber() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${datePart}-${randomPart}`;
}

module.exports = {
  // =========================
  // CREATE ORDER
  // =========================
  async create(items) {
    return knex.transaction(async (trx) => {
      const productIds = items.map(i => i.product_id);

      const products = await trx('products')
        .whereIn('id', productIds)
        .select('id', 'price', 'stock');

      if (products.length !== items.length) {
        throw new Error('One or more products not found');
      }

      let total = 0;

      const pricedItems = items.map(i => {
        const p = products.find(pp => pp.id === i.product_id);

        const qty = Number(i.quantity);
        const price = Number(p.price);
        const stock = Number(p.stock);

        if (qty <= 0) {
          throw new Error('Quantity must be positive');
        }

        if (stock < qty) {
          throw new Error(`Insufficient stock for product ${i.product_id}`);
        }

        const lineTotal = price * qty;
        total += lineTotal;

        return {
          product_id: i.product_id,
          quantity: qty,
          unit_price: price,
          line_total: lineTotal
        };
      });

      const [order] = await trx('orders')
        .insert({
          order_number: generateOrderNumber(),
          status: 'new',
          total
        })
        .returning('*');

      await trx('order_items').insert(
        pricedItems.map(pi => ({
          order_id: order.id,
          ...pi
        }))
      );

      for (const pi of pricedItems) {
        await trx('products')
          .where({ id: pi.product_id })
          .decrement('stock', pi.quantity);
      }

      return {
        ...order,
        items: pricedItems
      };
    });
  },

  // =========================
  // GET ONE ORDER
  // =========================
  async findById(id) {
    const order = await knex('orders').where({ id }).first();
    if (!order) return null;

    const items = await knex('order_items')
      .join('products', 'order_items.product_id', 'products.id')
      .where('order_items.order_id', id)
      .select(
        'products.name as product_name',
        'order_items.quantity',
        'order_items.unit_price',
        'order_items.line_total'
      );

    return { ...order, items };
  },

  // =========================
  // GET ALL ORDERS (ADMIN)
  // =========================
  async findAll() {
    const orders = await knex('orders')
      .select(
        'id',
        'order_number',
        'status',
        'total',
        'created_at'
      )
      .orderBy('created_at', 'desc');

    for (const order of orders) {
      order.items = await knex('order_items')
        .join('products', 'order_items.product_id', 'products.id')
        .where('order_items.order_id', order.id)
        .select(
          'products.name as product_name',
          'order_items.quantity',
          'order_items.unit_price',
          'order_items.line_total'
        );
    }

    return orders;
  },

  // =========================
  // UPDATE STATUS (ADMIN)
  // =========================
  async updateStatus(id, status) {
    const [row] = await knex('orders')
      .where({ id })
      .update({ status })
      .returning('*');

    return row || null;
  }
};
