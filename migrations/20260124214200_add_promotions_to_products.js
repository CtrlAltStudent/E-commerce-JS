exports.up = function (knex) {
  return knex.schema.table('products', table => {
    table.decimal('promo_price', 12, 2)
    table.timestamp('promo_from')
    table.timestamp('promo_to')
  })
}

exports.down = function (knex) {
  return knex.schema.table('products', table => {
    table.dropColumns('promo_price', 'promo_from', 'promo_to')
  })
}
