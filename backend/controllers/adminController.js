const Order = require("../models/Order");
const User = require("../models/User");
const Bill = require("../models/Bill");

// @route GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments();
    const pendingOrders = await Order.countDocuments({
      status: { $in: ["Placed", "Picked Up", "In Progress"] },
    });
    const completedOrders = await Order.countDocuments({ status: "Delivered" });

    const bills = await Bill.find();
    const totalRevenue = bills
      .filter((b) => b.paymentStatus === "Paid")
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingRevenue = bills
      .filter((b) => b.paymentStatus === "Unpaid")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate(
      "customer",
      "fullName email"
    );

    return res.json({
      totalOrders,
      totalCustomers,
      pendingOrders,
      completedOrders,
      totalRevenue,
      pendingRevenue,
      recentOrders,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not load dashboard stats", error: error.message });
  }
};

// @route GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate(
      "customer",
      "fullName email phone"
    );
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch orders", error: error.message });
  }
};

// @route PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: "Could not update order status", error: error.message });
  }
};

// @route GET /api/admin/customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(customers);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch customers", error: error.message });
  }
};

// @route DELETE /api/admin/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    await customer.deleteOne();
    return res.json({ message: "Customer removed" });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete customer", error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  deleteCustomer,
};
