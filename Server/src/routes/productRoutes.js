const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5), // Allow up to 5 images for luxury items
  createProduct,
);

router.get("/", getAllProduct);

router.get("/:id", getProductById);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  updateProduct,
);

router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
