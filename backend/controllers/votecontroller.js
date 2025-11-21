const db = require("../config/db");
const crypto = require('crypto');

// Generate unique confirmation ID
function generateConfirmationID() {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `VOTE-${timestamp}-${random}`;
}

// Cast a vote
exports.castVote = async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const { voterId, electionId, candidateId } = req.body; // Single candidate per vote (schema constraint)
    
    // Check if voter has already voted (unique constraint: VoterID + ElectionID)
    // PostgreSQL converts unquoted identifiers to lowercase
    const checkVoteQuery = 'SELECT * FROM votes WHERE voterid = $1 AND electionid = $2';
    const existingVote = await client.query(checkVoteQuery, [voterId, electionId]);
    
    if (existingVote.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "You have already voted in this election" });
    }
    
    // Check voter is verified
    const voterQuery = 'SELECT isverified FROM voters WHERE voterid = $1';
    const voterResult = await client.query(voterQuery, [voterId]);
    
    if (voterResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Voter not found" });
    }
    
    const voter = voterResult.rows[0];
    if (!voter.isverified) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: "Voter account is not verified" });
    }
    
    // Check election status and dates
    const electionQuery = 'SELECT isactive, startdate, enddate FROM elections WHERE electionid = $1';
    const electionResult = await client.query(electionQuery, [electionId]);
    
    if (electionResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Election not found" });
    }
    
    const election = electionResult.rows[0];
    const now = new Date();
    const startDate = new Date(election.startdate);
    const endDate = new Date(election.enddate);
    
    if (!election.isactive) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "Election is not currently active" });
    }
    
    if (startDate > now || endDate < now) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "Election is not in voting period" });
    }
    
    // Verify candidate belongs to this election
    const candidateCheckQuery = `
      SELECT candidateid FROM candidates 
      WHERE candidateid = $1 AND electionid = $2
    `;
    const candidateCheck = await client.query(candidateCheckQuery, [candidateId, electionId]);
    
    if (candidateCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "Invalid candidate for this election" });
    }
    
    // Cast vote (schema: VoteID, VoterID, CandidateID, ElectionID, VoteTimestamp, IPAddress)
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    const confirmationId = generateConfirmationID(); // Generate for response, not stored in DB
    
    const voteQuery = `
      INSERT INTO votes (voterid, electionid, candidateid, ipaddress)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const voteResult = await client.query(voteQuery, [
      voterId,
      electionId,
      candidateId,
      ipAddress
    ]);
    
    // Update candidate vote count
    const updateCandidateQuery = `
      UPDATE candidates 
      SET votes = votes + 1 
      WHERE candidateid = $1
    `;
    await client.query(updateCandidateQuery, [candidateId]);
    
    // Log to audit
    const auditQuery = `
      INSERT INTO audit_log (voterid, action, ipaddress)
      VALUES ($1, $2, $3)
    `;
    await client.query(auditQuery, [
      voterId,
      `Voted for candidate ${candidateId} in election ${electionId}`,
      ipAddress
    ]);
    
    await client.query('COMMIT');
    
    const vote = voteResult.rows[0];
    res.status(201).json({
      message: "Vote cast successfully",
      confirmationId: confirmationId,
      vote: {
        voteid: vote.voteid,
        voterid: vote.voterid,
        candidateid: vote.candidateid,
        electionid: vote.electionid,
        votetimestamp: vote.votetimestamp
      }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Cast vote error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Get vote history for a voter
exports.getVoteHistory = async (req, res) => {
  try {
    const { voterId } = req.params;
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = `
      SELECT 
        v.voteid,
        v.votetimestamp,
        e.electionname AS electiontitle,
        e.electionid,
        c.fullname AS candidatename,
        c.partyname,
        c.candidateid
      FROM votes v
      JOIN elections e ON v.electionid = e.electionid
      JOIN candidates c ON v.candidateid = c.candidateid
      WHERE v.voterid = $1
      ORDER BY v.votetimestamp DESC
    `;
    const result = await db.query(query, [voterId]);
    
    // Map to camelCase for frontend
    const history = result.rows.map(row => ({
      voteid: row.voteid,
      votetimestamp: row.votetimestamp,
      electiontitle: row.electiontitle,
      electionid: row.electionid,
      candidatename: row.candidatename,
      partyname: row.partyname,
      candidateid: row.candidateid
    }));
    
    res.json(history);
  } catch (error) {
    console.error("Get vote history error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get vote receipt by confirmation ID (Note: VoteReceipts table doesn't exist, using vote data)
exports.getVoteReceipt = async (req, res) => {
  try {
    const { confirmationId } = req.params;
    
    // VoteReceipts table doesn't exist in schema
    // Return a receipt based on vote data if we can match it
    // For now, return a placeholder structure
    res.status(404).json({ 
      error: "Receipt not found",
      message: "VoteReceipts table not implemented in current schema"
    });
  } catch (error) {
    console.error("Get receipt error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Check if voter has voted
exports.hasVoted = async (req, res) => {
  try {
    const { voterId, electionId } = req.params;
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = 'SELECT COUNT(*) as count FROM votes WHERE voterid = $1 AND electionid = $2';
    const result = await db.query(query, [voterId, electionId]);
    
    res.json({ 
      hasVoted: parseInt(result.rows[0].count) > 0 
    });
  } catch (error) {
    console.error("Check vote error:", error);
    res.status(500).json({ error: error.message });
  }
};
