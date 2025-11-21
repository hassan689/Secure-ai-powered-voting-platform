const express = require("express");
const router = express.Router();
const pollingStationController = require("../controllers/pollingStationController");

router.get("/", pollingStationController.getAllStations);
router.get("/nearby", pollingStationController.findNearbyStations);
router.get("/:id", pollingStationController.getStationById);

module.exports = router;

