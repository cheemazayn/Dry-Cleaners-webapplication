const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chatController");

// Public — no login required to talk to support
router.post("/", handleChat);

module.exports = router;
