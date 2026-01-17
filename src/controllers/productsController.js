// src/controllers/productsController.js
const Products = require('../models/products');

exports.getAll = async (req, res, next) => {
  try {
    const rows = await Products.findAll(req.query);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    // walidacja jest już wykonana w middleware
    const created = await Products.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Products.update(req.params.id, req.body);

    if (!updated) {
      return res
        .status(404)
        .json({ message: 'Product not found or no fields to update' });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await Products.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
