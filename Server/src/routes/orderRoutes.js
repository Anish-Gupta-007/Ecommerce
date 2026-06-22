const express = require("express");

const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/:id", authMiddleware, getOrderById);

router.get("/", authMiddleware, adminMiddleware, getAllOrders);

router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);
module.exports = router;
