const Categories = require('../models/categories');

// GET /api/categories
exports.getAll = async (req, res, next) => {
  try {
    const rows = await Categories.findAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/categories/:id
exports.getOne = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const row = await Categories.findById(id);

    if (!row) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(row);
  } catch (err) {
    next(err);
  }
};

// POST /api/categories
exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const created = await Categories.create({ name, description });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// PUT /api/categories/:id
exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await Categories.update(id, req.body);

    if (!updated) {
      return res
        .status(404)
        .json({ message: 'Category not found or no changes' });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/categories/:id
exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Categories.remove(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.getTree = async (req, res, next) => {
  try {
    const tree = await Categories.getTree();
    res.json(tree);
  } catch (err) {
    next(err);
  }
};
