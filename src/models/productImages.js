const knex = require('../db/knex');

module.exports = {
  create: async ({
    product_id,
    url,
    alt_text = null,
    position = 0,
    is_primary = false
  }) => {
    const [row] = await knex('product_images')
      .insert({
        product_id,
        url,
        alt_text,
        position,
        is_primary
      })
      .returning('*');

    return row;
  },

  findByProduct: (productId) => {
    return knex('product_images')
      .where({ product_id: productId })
      .orderBy('position');
  }
};
