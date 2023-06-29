const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../controllers/productControllers");

//importing authorization functions
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authentication");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/:id").get(getProductById);
router.route("/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route("/products/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router.route("/products/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;
