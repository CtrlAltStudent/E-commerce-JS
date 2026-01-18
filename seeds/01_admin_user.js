const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  await knex('users').del();

  const passwordHash = await bcrypt.hash('admin123', 10);

  await knex('users').insert({
    email: 'admin@example.com',
    password_hash: passwordHash,
    role_id: 1,
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  });
};

