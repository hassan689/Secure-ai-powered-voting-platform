const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

router.get("/election/:electionId", candidateController.getCandidatesByElection);
router.get("/:id", candidateController.getCandidateById);
router.post("/", candidateController.createCandidate);
router.post("/:candidateId/rate", candidateController.rateCandidate);
router.get("/:candidateId/ratings", candidateController.getCandidateRatings);

module.exports = router;

