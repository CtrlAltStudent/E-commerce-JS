const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const validate = require('../middleware/validate');
const { createProduct, updateProduct } = require('../validators/products');

// GET
router.get('/', productsController.getAll);
router.get('/:id', productsController.getOne);

// POST
router.post(
  '/',
  createProduct,
  validate,
  productsController.create
);

// PUT
router.put(
  '/:id',
  updateProduct,
  validate,
  productsController.update
);

// DELETE
router.delete('/:id', productsController.remove);

module.exports = router;
