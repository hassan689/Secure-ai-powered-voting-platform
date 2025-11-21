const express = require("express");
const { verifyVoter, getAllVoters } = require("../controllers/votorcontroller");
const router = express.Router();

router.get("/", getAllVoters);
router.put("/verify/:VoterID", verifyVoter);

module.exports = router;