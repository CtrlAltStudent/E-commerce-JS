const Orders = require('../models/orders');

exports.create = async (req, res, next) => {
  try {
    const order = await Orders.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const order = await Orders.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};
