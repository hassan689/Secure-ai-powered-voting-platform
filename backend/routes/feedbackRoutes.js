const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

router.post("/", feedbackController.submitFeedback);
router.get("/", feedbackController.getAllFeedback);
router.put("/:id/status", feedbackController.updateFeedbackStatus);

module.exports = router;

