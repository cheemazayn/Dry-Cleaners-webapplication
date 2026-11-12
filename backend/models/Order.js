const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      enum: ["Washing", "Dry Cleaning", "Ironing", "Stain Removal"],
      required: true,
    },
    garment: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    pricePerItem: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [itemSchema], required: true },
    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    specialInstructions: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Placed", "Picked Up", "In Progress", "Ready", "Delivered", "Cancelled"],
      default: "Placed",
    },
    totalAmount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
