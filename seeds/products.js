exports.seed = async function (knex) {
  await knex('products').del();

  await knex('products').insert([
    {
      name: 'Laptop Lenovo',
      description: 'Laptop biznesowy 15.6", i5, 16GB RAM',
      price: 3999.99,
      stock: 10
    },
    {
      name: 'Procesor Intel Core i7-12700K',
      description: '12-rdzeniowy procesor do komputerów stacjonarnych',
      price: 1799.99,
      stock: 5
    },
    {
      name: 'Karta graficzna NVIDIA RTX 4060',
      description: 'Nowoczesna karta graficzna do gier i pracy',
      price: 2499.99,
      stock: 7
    },
    {
      name: 'Płyta główna ASUS B760',
      description: 'Płyta główna ATX pod Intel 12/13 gen',
      price: 699.99,
      stock: 12
    },
    {
      name: 'Pamięć RAM Corsair 32GB DDR5',
      description: 'Zestaw 2x16GB DDR5 5600MHz',
      price: 899.99,
      stock: 15
    }
  ]);
};
