const Bill = require("../models/Bill");

// @route GET /api/bills/my-bills  (customer)
const getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("order", "orderNumber status");
    return res.json(bills);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch bills", error: error.message });
  }
};

// @route GET /api/bills  (admin — all bills)
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .sort({ createdAt: -1 })
      .populate("customer", "fullName email")
      .populate("order", "orderNumber status");
    return res.json(bills);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch bills", error: error.message });
  }
};

// @route PUT /api/bills/:id/pay  (admin marks a bill paid)
const markBillPaid = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    bill.paymentStatus = "Paid";
    if (req.body.paymentMethod) bill.paymentMethod = req.body.paymentMethod;
    await bill.save();
    return res.json(bill);
  } catch (error) {
    return res.status(500).json({ message: "Could not update bill", error: error.message });
  }
};

module.exports = { getMyBills, getAllBills, markBillPaid };
