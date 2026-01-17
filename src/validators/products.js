const { body, param } = require('express-validator');

exports.createProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be an integer >= 0')
];

exports.updateProduct = [
  param('id')
    .isInt()
    .withMessage('Product ID must be an integer'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be an integer >= 0')
];
