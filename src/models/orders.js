const knex = require('../db/knex');

const generateOrderNumber = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 10000);

  return `ORD-${y}${m}${d}-${rand}`;
};


exports.create = async (data) => {
  const { items } = data;

  if (!Array.isArray(items) || items.length === 0) {
    throw { status: 400, message: 'Order items are required' };
  }

  return knex.transaction(async trx => {
    // 1. Pobierz produkty
    const productIds = items.map(i => i.product_id);

    const products = await trx('products')
      .whereIn('id', productIds)
      .select('id', 'price', 'stock');

    if (products.length !== items.length) {
      throw { status: 400, message: 'One or more products not found' };
    }

    // 2. Sprawdź stock
    for (const item of items) {
      const product = products.find(p => p.id === item.product_id);

      if (product.stock < item.quantity) {
        throw {
          status: 400,
          message: `Not enough stock for product ${product.id}`
        };
      }
    }

    // 3. Oblicz total
    let total = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.product_id);
      const lineTotal = product.price * item.quantity;
      total += lineTotal;

      return {
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.price,
        line_total: lineTotal
      };
    });

    // 4. Utwórz order
    const [order] = await trx('orders')
    .insert({
        order_number: generateOrderNumber(),
        total,
        status: 'created'
    })
    .returning('*');


    // 5. Utwórz order_items
    const itemsToInsert = orderItems.map(i => ({
      order_id: order.id,
      ...i
    }));

    await trx('order_items').insert(itemsToInsert);

    // 6. Zmniejsz stock
    for (const item of items) {
      await trx('products')
        .where({ id: item.product_id })
        .decrement('stock', item.quantity);
    }

    // 7. Zwróć zamówienie
    return {
      ...order,
      items: orderItems
    };
  });
};

exports.findById = async (id) => {
  const order = await knex('orders')
    .where({ id })
    .first();

  if (!order) return null;

  const items = await knex('order_items')
    .where({ order_id: id })
    .select(
      'product_id',
      'quantity',
      'unit_price',
      'line_total'
    );

  return {
    ...order,
    items
  };
};
