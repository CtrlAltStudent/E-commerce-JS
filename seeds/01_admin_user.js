const bcrypt = require("bcryptjs");

exports.seed = async function(knex) {
  // zakładamy, że tabela roles istnieje i że admin role ma id = 1
  // jeśli nie masz role admin, możesz zamiast role_id przypisać NULL lub utworzyć role seed wcześniej
  const passwordHash = bcrypt.hashSync("Admin123!", 10);

  // sprawdź czy jest użytkownik admin@example.com
  const existing = await knex("users").where({ email: "admin@example.com" }).first();
  if (existing) {
    console.log("Admin user already exists");
    return;
  }

  await knex("users").insert({
    email: "admin@example.com",
    password: passwordHash,
    role_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  });

  console.log("Admin user created: admin@example.com / Admin123!");
};
