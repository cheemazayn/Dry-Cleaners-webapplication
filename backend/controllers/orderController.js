const Order = require("../models/Order");
const Bill = require("../models/Bill");
const { sendOrderNotification } = require("../utils/sendEmail");

const generateOrderNumber = () => {
  return "DC-" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
};

const generateInvoiceNumber = () => {
  return "INV-" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
};

// @route POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { items, pickupDate, pickupTime, deliveryAddress, specialInstructions } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Please add at least one item to your order" });
    }
    if (!pickupDate || !pickupTime || !deliveryAddress) {
      return res.status(400).json({ message: "Pickup date, time and address are required" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.pricePerItem,
      0
    );

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: req.user._id,
      items,
      pickupDate,
      pickupTime,
      deliveryAddress,
      specialInstructions,
      totalAmount,
    });

    // Auto-generate a matching bill (billing module)
    const tax = Math.round(totalAmount * 0.05 * 100) / 100; // 5% dummy tax
    await Bill.create({
      invoiceNumber: generateInvoiceNumber(),
      order: order._id,
      customer: req.user._id,
      subtotal: totalAmount,
      tax,
      totalAmount: totalAmount + tax,
    });

    // Alert the admin by email — awaited so errors are logged, but it never blocks or fails the order
    await sendOrderNotification(order, req.user);

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Could not place order", error: error.message });
  }
};

// @route GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch orders", error: error.message });
  }
};

// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Customers may only view their own orders
    if (req.user && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch order", error: error.message });
  }
};

// @route GET /api/orders/track/:orderNumber
const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ message: "No order found with that order number" });
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: "Tracking failed", error: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, trackOrder };