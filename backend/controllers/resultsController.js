const db = require("../config/db");

// Get election results
exports.getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    
    // Check election exists and dates
    // PostgreSQL converts unquoted identifiers to lowercase
    const electionQuery = 'SELECT enddate FROM elections WHERE electionid = $1';
    const electionResult = await db.query(electionQuery, [electionId]);
    
    if (electionResult.rows.length === 0) {
      return res.status(404).json({ error: "Election not found" });
    }
    
    const election = electionResult.rows[0];
    const now = new Date();
    const endDate = new Date(election.enddate);
    
    // Only show results if election has ended
    if (endDate > now) {
      return res.status(403).json({ error: "Results will be available after the election ends" });
    }
    
    const query = `
      SELECT 
        c.candidateid,
        c.fullname AS candidatename,
        c.partyname,
        COUNT(v.voteid) AS votecount,
        ROUND(COUNT(v.voteid) * 100.0 / NULLIF((SELECT COUNT(*) FROM votes WHERE electionid = $1), 0), 2) AS votepercentage
      FROM candidates c
      LEFT JOIN votes v ON c.candidateid = v.candidateid AND v.electionid = $1
      WHERE c.electionid = $1
      GROUP BY c.candidateid, c.fullname, c.partyname
      ORDER BY votecount DESC
    `;
    
    const result = await db.query(query, [electionId]);
    
    // Get total votes
    const totalVotesQuery = 'SELECT COUNT(*) as total FROM votes WHERE electionid = $1';
    const totalResult = await db.query(totalVotesQuery, [electionId]);
    
    const candidates = result.rows.map(row => ({
      candidateid: row.candidateid,
      candidatename: row.candidatename,
      partyname: row.partyname,
      votecount: parseInt(row.votecount) || 0,
      votepercentage: parseFloat(row.votepercentage) || 0
    }));
    
    res.json({
      electionid: parseInt(electionId),
      totalvotes: parseInt(totalResult.rows[0].total) || 0,
      candidates: candidates
    });
  } catch (error) {
    console.error("Get results error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get real-time vote count (for active elections)
exports.getRealTimeVoteCount = async (req, res) => {
  try {
    const { electionId } = req.params;
    
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = `
      SELECT 
        c.candidateid,
        c.fullname AS candidatename,
        c.partyname,
        COUNT(v.voteid) AS votecount
      FROM candidates c
      LEFT JOIN votes v ON c.candidateid = v.candidateid AND v.electionid = $1
      WHERE c.electionid = $1
      GROUP BY c.candidateid, c.fullname, c.partyname
      ORDER BY votecount DESC
    `;
    
    const result = await db.query(query, [electionId]);
    
    // Get total votes
    const totalVotesQuery = 'SELECT COUNT(*) as total FROM votes WHERE electionid = $1';
    const totalResult = await db.query(totalVotesQuery, [electionId]);
    
    const candidates = result.rows.map(row => ({
      candidateid: row.candidateid,
      candidatename: row.candidatename,
      partyname: row.partyname,
      votecount: parseInt(row.votecount) || 0
    }));
    
    res.json({
      electionid: parseInt(electionId),
      totalvotes: parseInt(totalResult.rows[0].total) || 0,
      candidates: candidates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Get real-time count error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get voting statistics
exports.getVotingStatistics = async (req, res) => {
  try {
    const { electionId } = req.params;
    
    // PostgreSQL converts unquoted identifiers to lowercase
    // Schema doesn't have IsEligible column, only IsVerified
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM voters WHERE isverified = TRUE) AS total_eligible_voters,
        (SELECT COUNT(*) FROM votes WHERE electionid = $1) AS total_votes_cast,
        (SELECT COUNT(DISTINCT voterid) FROM votes WHERE electionid = $1) AS unique_voters,
        (SELECT COUNT(*) FROM candidates WHERE electionid = $1) AS total_candidates
    `;
    
    const result = await db.query(statsQuery, [electionId]);
    
    const stats = result.rows[0];
    const totalEligible = parseInt(stats.total_eligible_voters) || 0;
    const totalVotes = parseInt(stats.total_votes_cast) || 0;
    const turnout = totalEligible > 0 
      ? ((totalVotes / totalEligible) * 100).toFixed(2)
      : 0;
    
    res.json({
      total_eligible_voters: totalEligible,
      total_votes_cast: totalVotes,
      unique_voters: parseInt(stats.unique_voters) || 0,
      total_candidates: parseInt(stats.total_candidates) || 0,
      turnout_percentage: parseFloat(turnout)
    });
  } catch (error) {
    console.error("Get statistics error:", error);
    res.status(500).json({ error: error.message });
  }
};

