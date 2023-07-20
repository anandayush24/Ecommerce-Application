const express = require("express");
const router = express.Router();
const {
  newOrder,
  myOrders,
  getSingleOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authentication");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/order/me").get(isAuthenticatedUser, myOrders);
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
router.route("/admin/order/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
