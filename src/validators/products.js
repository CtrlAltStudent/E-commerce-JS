const { body, param } = require('express-validator');

exports.createProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be an integer >= 0'),

  body('category_id')
    .isInt({ gt: 0 })
    .withMessage('category_id is required and must be a positive integer')
];

exports.updateProduct = [
  param('id')
    .isInt()
    .withMessage('Product ID must be an integer'),

  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be an integer >= 0'),

  body('category_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('category_id must be a positive integer')
];
