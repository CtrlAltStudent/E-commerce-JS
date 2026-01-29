const knex = require('../db/knex')

module.exports = {
  async findByProductId(productId) {
    return knex('product_images')
      .where({ product_id: productId })
      .orderBy('position', 'asc')
  },

  async createMany(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('No images to save')
    }

    const inserted = await knex('product_images')
      .insert(rows)
      .returning('*')

    return inserted
  },

  async clearPrimary(productId) {
    await knex('product_images')
      .where({ product_id: productId })
      .update({ is_primary: false })
  },

  async setPrimary(imageId) {
    const img = await knex('product_images')
      .where({ id: imageId })
      .first()

    if (!img) throw new Error('Image not found')

    await knex('product_images')
      .where({ product_id: img.product_id })
      .update({ is_primary: false })

    await knex('product_images')
      .where({ id: imageId })
      .update({ is_primary: true })

    return true
  }
}
