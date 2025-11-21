const express = require("express");
const router = express.Router();
const educationController = require("../controllers/educationController");

router.get("/", educationController.getResources);
router.get("/:id", educationController.getResourceById);
router.post("/", educationController.createResource);

module.exports = router;

