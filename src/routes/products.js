const express = require('express');
const router = express.Router();

const requireAdmin = require('../middleware/requireAdmin');
const ctrl = require('../controllers/productsController');
const validate = require('../middleware/validate');
const { createProduct, updateProduct } = require('../validators/products');
const upload = require('../middleware/upload');
const productImagesController = require('../controllers/productImagesController');


// newest / promotions
router.get('/newest', ctrl.getNewest);
router.get('/promotions', ctrl.getPromotions);

// list
router.get('/', ctrl.getAll);

// images
router.get('/:id/images', productImagesController.getImages);

// single product
router.get('/:id', ctrl.getOne);

// ===== ADMIN =====

// create product
router.post(
  '/',
  requireAdmin,
  createProduct,
  validate,
  ctrl.create
);

// update product
router.put(
  '/:id',
  requireAdmin,
  updateProduct,
  validate,
  ctrl.update
);

// delete product
router.delete(
  '/:id',
  requireAdmin,
  ctrl.remove
);

// upload images
router.post(
  '/:id/images',
  requireAdmin,
  upload.array('images', 5),
  productImagesController.upload
);

module.exports = router;
