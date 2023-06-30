//importing required files
const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  getAllUsers,
  getUser,
  updateUserRole,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authentication");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/me").get(getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/admin/allUsers").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUser);
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);
router.route("admin/user/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);
router.route("admin/user/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
