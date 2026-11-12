const jwt = require("jsonwebtoken");

// role is "customer" or "admin"
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = generateToken;
