const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/voter/:voterId", notificationController.getNotifications);
router.get("/voter/:voterId/unread-count", notificationController.getUnreadCount);
router.put("/:id/read", notificationController.markAsRead);
router.put("/voter/:voterId/read-all", notificationController.markAllAsRead);
router.post("/", notificationController.createNotification);

module.exports = router;

