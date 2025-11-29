exports.seed = async function(knex) {
  // clear relevant tables (safe for demo)
  await knex("product_images").del().catch(()=>{});
  await knex("product_categories").del().catch(()=>{});
  await knex("products").del().catch(()=>{});
  await knex("categories").del().catch(()=>{});
  await knex("roles").del().catch(()=>{});
  await knex("users").del().catch(()=>{});

  // roles
  await knex("roles").insert([
    { id: 1, name: "admin", description: "Administrator" },
    { id: 2, name: "customer", description: "Regular customer" }
  ]);

  // test user (password_hash placeholder - change later)
  await knex("users").insert([
    { id: 1, role_id: 1, email: "admin@example.com", password_hash: "changeme", first_name: "Admin", last_name: "User", is_active: true }
  ]);

  // categories
  await knex("categories").insert([
    { id: 1, name: "Electronics", description: "Elektronika" },
    { id: 2, name: "Clothing", description: "Odzież" }
  ]);

  // products
  await knex("products").insert([
    { id: 1, sku: "SKU-001", name: "Example Product A", description: "Demo product A", price: 19.99, stock: 10 },
    { id: 2, sku: "SKU-002", name: "Example Product B", description: "Demo product B", price: 29.99, stock: 5 }
  ]);

  // product_categories links
  await knex("product_categories").insert([
    { product_id: 1, category_id: 1 },
    { product_id: 2, category_id: 2 }
  ]);

  // product images
  await knex("product_images").insert([
    { product_id: 1, url: "https://example.com/p1.jpg", alt_text: "Product A", is_primary: true },
    { product_id: 2, url: "https://example.com/p2.jpg", alt_text: "Product B", is_primary: true }
  ]);
};
