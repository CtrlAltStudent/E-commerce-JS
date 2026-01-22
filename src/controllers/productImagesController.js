const ProductImages = require('../models/productImages');

exports.getImages = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const images = await ProductImages.findByProductId(productId);
    res.json(images);
  } catch (err) {
    next(err);
  }
};

exports.upload = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    if (req.body.is_primary === 'true') {
      await ProductImages.clearPrimary(productId);
    }


    // 🔹 TU SKŁADAMY DANE DO BAZY
    const images = req.files.map((file, index) => ({
      product_id: productId,
      url: `/uploads/products/${file.filename}`,
      alt_text: req.body.alt_text || null,
      position: index,
      is_primary: req.body.is_primary === 'true'
    }));

    // 🔹 MODEL DOSTAJE GOTOWĄ TABLICĘ
    const saved = await ProductImages.createMany(images);

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};
