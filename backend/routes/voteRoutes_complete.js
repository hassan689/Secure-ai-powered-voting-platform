const express = require("express");
const router = express.Router();
const voteController = require("../controllers/votecontroller");
const resultsController = require("../controllers/resultsController");

// Voting routes
router.post("/cast", voteController.castVote);
router.get("/history/:voterId", voteController.getVoteHistory);
router.get("/receipt/:confirmationId", voteController.getVoteReceipt);
router.get("/has-voted/:voterId/:electionId", voteController.hasVoted);

// Results routes
router.get("/results/:electionId", resultsController.getElectionResults);
router.get("/realtime/:electionId", resultsController.getRealTimeVoteCount);
router.get("/statistics/:electionId", resultsController.getVotingStatistics);

module.exports = router;

