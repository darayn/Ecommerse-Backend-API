const express =  require("express");
const router = express.Router()
const { addProduct } = require("../controllers/productController");
const { isLoggedIn, customRole } = require("../middlewares/user");


module.exports = router;
