exports.seed = async function (knex) {
  await knex('roles').del();

  await knex('roles').insert([
    {
      id: 1,
      name: 'admin',
      description: 'Administrator',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      id: 2,
      name: 'customer',
      description: 'Customer',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};
