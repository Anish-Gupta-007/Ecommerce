const User = require("../models/userModels");
const Product = require("../models/productModels");
const Order = require("../models/orderModel");

const getDashboardStats = async (req, res) => {
  try {
    // Basic Counts
    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    // Only Delivered Orders For Revenue
    const deliveredOrders = await Order.find({
      orderStatus: "Delivered",
    });

    const totalRevenue = deliveredOrders.reduce(
      (acc, order) => acc + order.totalAmount,
      0,
    );

    // Status Wise Order Count (Bonus)
    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const deliveredOrdersCount = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders: deliveredOrdersCount,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
