const knex = require("../db/knex");

// get all categories
exports.getAll = async (req, res, next) => {
  try {
    const rows = await knex("categories").select("id","name","slug","description","created_at","updated_at").orderBy("id");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// get one category
exports.getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const row = await knex("categories").where({ id }).first();
    if (!row) return res.status(404).json({ message: "Category not found" });
    res.json(row);
  } catch (err) {
    next(err);
  }
};

// create
exports.create = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    const [created] = await knex("categories").insert({ name, slug, description }).returning("*");
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// update
exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const { name, slug, description } = req.body;
    const [updated] = await knex("categories").where({ id }).update({ name, slug, description, updated_at: knex.fn.now() }).returning("*");
    if (!updated) return res.status(404).json({ message: "Category not found or no changes" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// remove
exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const del = await knex("categories").where({ id }).del();
    if (!del) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
