const express = require("express");
const router = express.Router();

const { register, loginUser, GetMe, getAllUsers, getWishlist, toggleWishlist } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/register", register);
router.post("/login", loginUser);
router.get("/me", authMiddleware, GetMe);
router.get("/admin-test", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ success: true, message: "Admin access granted" });
});
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// Wishlist
router.get("/wishlist", authMiddleware, getWishlist);
router.post("/wishlist", authMiddleware, toggleWishlist);

module.exports = router;
