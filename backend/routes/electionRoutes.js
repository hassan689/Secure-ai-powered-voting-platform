const express = require("express");
const router = express.Router();
const electionController = require("../controllers/electionController");

router.get("/", electionController.getAllElections);
router.get("/active", electionController.getActiveElections);
router.get("/:id", electionController.getElectionById);
router.post("/", electionController.createElection);
router.put("/:id/status", electionController.updateElectionStatus);
router.put("/:id/publish-results", electionController.publishResults);

module.exports = router;

