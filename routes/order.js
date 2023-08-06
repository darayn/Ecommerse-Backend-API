const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOneOrder,
  getLoggedInOrders,
} = require("../controllers/orderController");
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/myorder").get(isLoggedIn, getLoggedInOrders);
router.route("/order/:id").get(isLoggedIn, getOneOrder);

module.exports = router;
