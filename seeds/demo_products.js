exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      return knex('products').insert([
        { name: 'Example Product A', description: 'Test product A', price: 19.99, stock: 10 },
        { name: 'Example Product B', description: 'Test product B', price: 29.99, stock: 5 }
      ]);
    });
};
