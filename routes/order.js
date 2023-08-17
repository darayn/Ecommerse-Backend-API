const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOneOrder,
  getLoggedInOrders,
  adminGetAllOrders,
} = require("../controllers/orderController");
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/myorder").get(isLoggedIn, getLoggedInOrders);
router.route("/order/:id").get(isLoggedIn, getOneOrder);

// admin routes
router
  .route("/admin/orders")
  .get(isLoggedIn, customRole("admin"), adminGetAllOrders);
router
  .route("/admin/orders")
  .get(isLoggedIn, customRole("admin"), adminGetAllOrders);

module.exports = router;
