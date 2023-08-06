const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/order/create").post(isLoggedIn, createOrder);

module.exports = router;
