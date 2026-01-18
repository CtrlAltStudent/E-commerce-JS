const ProductImages = require('../models/productImages');

exports.upload = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    if (!productId) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const images = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      const image = await ProductImages.create({
        product_id: productId,
        url: `/uploads/products/${file.filename}`,
        position: i,
        is_primary: i === 0
      });

      images.push(image);
    }

    res.status(201).json(images);
  } catch (err) {
    next(err);
  }
};
