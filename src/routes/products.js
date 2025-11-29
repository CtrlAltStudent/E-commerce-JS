const express = require("express");
const router = express.Router();
const knex = require("../db/knex"); // zakładam, że masz ./src/db/knex.js lub analogiczny export

// GET /api/products
router.get("/", async (req, res, next) => {
  try {
    const products = await knex("products").select("id","sku","name","description","price","stock","is_active","created_at","updated_at").orderBy("id");
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const product = await knex("products").where({ id }).first();
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
