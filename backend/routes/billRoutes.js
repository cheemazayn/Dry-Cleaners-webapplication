const express = require("express");
const router = express.Router();
const { getMyBills, getAllBills, markBillPaid } = require("../controllers/billController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/my-bills", protect, getMyBills);
router.get("/", protect, adminOnly, getAllBills);
router.put("/:id/pay", protect, adminOnly, markBillPaid);

module.exports = router;
