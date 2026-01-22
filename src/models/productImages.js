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

module.exports = {
  async createMany(productId, files, body) {
    const images = files.map((file, index) => ({
      product_id: productId,
      url: `/uploads/products/${file.filename}`,
      alt_text: body.alt_text || null,
      position: index,
      is_primary: body.is_primary === 'true'
    }));

    return knex('product_images')
      .insert(images)
      .returning('*');
  },

  async findByProductId(productId) {
    return knex('product_images')
      .where({ product_id: productId })
      .orderBy('position', 'asc');
  },

  async clearPrimary(productId) {
      return knex('product_images')
        .where({ product_id: productId })
        .update({ is_primary: false });
    },
};
