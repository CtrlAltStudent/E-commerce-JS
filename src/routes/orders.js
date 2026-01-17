const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/ordersController');
const validate = require('../middleware/validate');
const { createOrder } = require('../validators/orders');

// POST /api/orders
router.post(
  '/',
  createOrder,
  validate,
  ordersController.create
);

// GET /api/orders/:id
router.get('/:id', ordersController.getOne);

module.exports = router;
