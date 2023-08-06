const Order = require("../models/order");
const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromise");

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    shippingAmount,
    totalAmount,
    taxAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    shippingAmount,
    totalAmount,
    taxAmount,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});
