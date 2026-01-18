const knex = require('../db/knex');

function generateOrderNumber() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${datePart}-${randomPart}`;
}

module.exports = {
  async create(items) {
    return await knex.transaction(async (trx) => {
      const productIds = items.map(i => i.product_id);

      const products = await trx('products')
        .whereIn('id', productIds)
        .select('id', 'price', 'stock');

      // 🔴 walidacja istnienia produktów
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

        // 🔴 sprawdzenie stanu magazynowego
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

      // 🔴 utworzenie zamówienia
      const [order] = await trx('orders')
        .insert({
          order_number: generateOrderNumber(),
          status: 'new',
          total
        })
        .returning('*');

      // 🔴 zapis pozycji
      await trx('order_items').insert(
        pricedItems.map(pi => ({
          order_id: order.id,
          ...pi
        }))
      );

      // 🔴 aktualizacja stanów magazynowych
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

  async findById(id) {
    const order = await knex('orders').where({ id }).first();
    if (!order) return null;

    const items = await knex('order_items')
      .where({ order_id: id })
      .select('product_id', 'quantity', 'unit_price', 'line_total');

    return { ...order, items };
  }
};
