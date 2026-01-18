const Orders = require('../models/orders');

exports.create = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Order items must be a non-empty array'
      });
    }

    const order = await Orders.create(items);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const order = await Orders.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};
