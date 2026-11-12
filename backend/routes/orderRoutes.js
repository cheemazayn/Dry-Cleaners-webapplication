const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/track/:orderNumber", trackOrder); // public tracking by order number
router.get("/:id", protect, getOrderById);

module.exports = router;
