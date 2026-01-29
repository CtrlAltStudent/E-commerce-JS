const express = require('express');
const router = express.Router();

const requireAdmin = require('../middleware/requireAdmin');
const ordersController = require('../controllers/ordersController');
const validate = require('../middleware/validate');
const { createOrder } = require('../validators/orders');

router.get('/', ordersController.getAll);

// POST /api/orders
router.post(
  '/',
  createOrder,
  validate,
  ordersController.create
);

// GET /api/orders/:id
router.get('/:id', ordersController.getOne);
router.put('/:id/status', requireAdmin,ordersController.updateStatus);

module.exports = router;
