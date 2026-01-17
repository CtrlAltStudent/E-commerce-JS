const { body } = require('express-validator');

exports.createOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order items must be a non-empty array'),

  body('items.*.product_id')
    .isInt({ gt: 0 })
    .withMessage('product_id must be a positive integer'),

  body('items.*.quantity')
    .isInt({ gt: 0 })
    .withMessage('quantity must be a positive integer')
];
