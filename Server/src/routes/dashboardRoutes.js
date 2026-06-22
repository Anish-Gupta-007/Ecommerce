const express = require("express");

const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;
