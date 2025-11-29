const bcrypt = require("bcryptjs");

exports.seed = async function(knex) {
  // Usuń istniejących testowych użytkowników (opcjonalnie)
  await knex('users').del();

  const pwd = "Admin123!"; // hasło admina, zmień jeśli chcesz
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pwd, salt);

  // zakładamy, że masz tabelę roles i w niej role 'admin' albo używamy null
  // jeśli masz tabelę roles, możesz ustawić role_id na konkretną wartość
  await knex('users').insert([
    { email: 'admin@example.com', password_hash: hash, first_name: 'Admin', last_name: 'User' }
  ]);
  console.log('Seed: admin@example.com / Admin123!');
};
