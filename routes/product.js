const express =  require("express");
const router = express.Router()
const {
  addProduct,
  getAllProduct,
  adminGetAllProduct,
  getOneProduct,
  adminUpdateOneProduct
} = require("../controllers/productController");
const { isLoggedIn, customRole } = require("../middlewares/user");


// user routes
router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);

// admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole('admin'), addProduct);

router
  .route("/admin/products")
  .get(isLoggedIn, customRole('admin'), adminGetAllProduct)

router
  .route("/admin/product/:id")
  .get(isLoggedIn, customRole('admin'), adminUpdateOneProduct)

module.exports = router;
