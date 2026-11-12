const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, address, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ fullName, email, phone, address, password });

    return res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      token: generateToken(user._id, "customer"),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id, "customer"),
      });
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @route GET /api/auth/profile
const getProfile = async (req, res) => {
  return res.json(req.user);
};

// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = req.body.fullName || user.fullName;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    const updated = await user.save();
    return res.json({
      _id: updated._id,
      fullName: updated.fullName,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
    });
  } catch (error) {
    return res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// @route POST /api/auth/admin-login
// Hardcoded/dummy admin credentials, read from .env (ADMIN_USERNAME / ADMIN_PASSWORD)
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return res.json({
      username,
      role: "admin",
      token: generateToken(username, "admin"),
    });
  }

  return res.status(401).json({ message: "Invalid admin username or password" });
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, adminLogin };
