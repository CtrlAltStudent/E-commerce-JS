/*
  src/controllers/productsController.js
  Bezpieczny CommonJS export — używa module.exports = {...}
*/
const Products = require('../models/products');

const parseNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

async function getAll(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : undefined;
    const rows = await Products.findAll({ limit, offset });
    res.json(rows);
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.name) return res.status(400).json({ message: 'Name is required' });
    if (body.price !== undefined && parseNumber(body.price) === null) {
      return res.status(400).json({ message: 'Price must be a number' });
    }
    const created = await Products.create(body);
    res.status(201).json(created);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const body = req.body || {};
    const updated = await Products.update(req.params.id, body);
    if (!updated) return res.status(404).json({ message: 'Product not found or no data to update' });
    res.json(updated);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const deleted = await Products.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
};
