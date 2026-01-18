exports.seed = async function (knex) {
  await knex('categories').del();

  await knex('categories').insert([
    {
      name: 'Laptopy',
      description: 'Laptopy i notebooki'
    },
    {
      name: 'Procesory',
      description: 'Procesory do komputerów'
    },
    {
      name: 'Karty graficzne',
      description: 'GPU do gier i pracy'
    },
    {
      name: 'Płyty główne',
      description: 'Płyty główne ATX i mATX'
    }
  ]);
};
