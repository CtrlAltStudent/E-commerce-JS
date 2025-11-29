const Categories = require("../models/categories");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      const rows = await Categories.findAll({ limit: limit ? parseInt(limit,10) : undefined, offset: offset ? parseInt(offset,10) : undefined });
      res.json(rows);
    } catch (err) { next(err); }
  },

  getOne: async (req, res, next) => {
    try {
      const category = await Categories.findById(req.params.id);
      if (!category) return res.status(404).json({ message: "Category not found" });
      res.json(category);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const { name, slug, description } = req.body;
      if (!name || !slug) return res.status(400).json({ message: "name and slug required" });
      const created = await Categories.create({ name, slug, description });
      res.status(201).json(created);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const data = req.body;
      const updated = await Categories.update(req.params.id, data);
      if (!updated) return res.status(404).json({ message: "Category not found" });
      res.json(updated);
    } catch (err) { next(err); }
  },

  remove: async (req, res, next) => {
    try {
      await Categories.remove(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
};
