const express = require("express");
const router = express.Router();
const messageController = require("../controllers/MessageController");

// Routes pour les messages
router.post("/send", messageController.sendMessage);
router.get("/conversation/:userId1/:userId2", messageController.getMessages);
router.put("/read/:messageId", messageController.markMessageAsRead);

module.exports = router;
