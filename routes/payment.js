const express = require("express");
const router = express.Router();
const {
    sendStripeKey,
    sendRazorpayKey,
    captureStripePayment,
    captureRazorpayPayment,
} = require("../controllers/paymentController");

const { isLoggedIn } = require("../middlewares/user");


router.route("/payment/stripekey").get(isLoggedIn, sendStripeKey);
router.route("/payment/razorpaykey").get(isLoggedIn, sendRazorpayKey);
router.route("/payment/capturestripe").post(isLoggedIn, captureStripePayment);
router.route("/payment/capturerazorpay").post(isLoggedIn, captureRazorpayPayment);

module.exports = router;
