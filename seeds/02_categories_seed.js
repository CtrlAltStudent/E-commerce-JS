exports.seed = async function(knex) {
  // Usuń dane z tabel (tylko demo, w prawdziwym sklepie nie robimy .del() w seedach produkcyjnych)
  await knex("product_categories").del();
  await knex("categories").del();

  // Wstaw przykładowe kategorie
  const inserted = await knex("categories")
    .insert([
      { name: "Electronics", slug: "electronics", description: "Phones, laptops, gadgets" },
      { name: "Books", slug: "books", description: "Books and magazines" },
      { name: "Home", slug: "home", description: "Furniture and home accessories" },
      { name: "Sports", slug: "sports", description: "Sport equipment and clothing" }
    ])
    .returning("*");

  console.log("Categories seed inserted:", inserted.length);
};
