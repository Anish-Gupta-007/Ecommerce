const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Not authorized as an admin" });
  }
  next();
};

module.exports = adminMiddleware;
