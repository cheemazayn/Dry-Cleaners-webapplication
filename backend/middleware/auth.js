const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies token, attaches req.user (customer) or req.admin (admin)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === "admin") {
        req.admin = { username: decoded.id, role: "admin" };
      } else {
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
          return res.status(401).json({ message: "User not found, authorization denied" });
        }
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Only allows admins through
const adminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};

module.exports = { protect, adminOnly };
