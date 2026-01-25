const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/productsController');
const validate = require('../middleware/validate');
const { createProduct, updateProduct } = require('../validators/products');
const upload = require('../middleware/upload');
const productImagesController = require('../controllers/productImagesController');

// GET
router.get('/newest', ctrl.getNewest);
router.get('/', ctrl.getAll);
router.get('/:id/images', productImagesController.getImages); 
router.get('/new', ctrl.getNewest);
router.get('/promotions', ctrl.getPromotions)
router.get('/:id', ctrl.getOne);

// POST
router.post(
  '/',
  createProduct,
  validate,
  ctrl.create
);

// PUT
router.put(
  '/:id',
  updateProduct,
  validate,
  ctrl.update
);

// DELETE
router.delete('/:id', ctrl.remove);

// POST /api/products/:id/images
router.post(
  '/:id/images',
  upload.array('images', 5),
  productImagesController.upload
);

module.exports = router;
