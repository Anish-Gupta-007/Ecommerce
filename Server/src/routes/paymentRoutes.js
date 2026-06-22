const express = require("express");
const router = express.Router();

const { createRazorpayOrder } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/razorpay", authMiddleware, createRazorpayOrder);

module.exports = router;
