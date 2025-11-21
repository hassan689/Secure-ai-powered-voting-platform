const db = require("../config/db");

// Get all candidates for an election
exports.getCandidatesByElection = async (req, res) => {
  try {
    const { electionId } = req.params;
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = `
      SELECT 
        c.candidateid,
        c.fullname,
        c.partyname,
        c.electionid,
        c.votes,
        c.bio,
        c.photourl,
        c.createdat,
        COUNT(DISTINCT v.voteid) AS vote_count
      FROM candidates c
      LEFT JOIN votes v ON c.candidateid = v.candidateid
      WHERE c.electionid = $1
      GROUP BY c.candidateid, c.fullname, c.partyname, c.electionid, c.votes, c.bio, c.photourl, c.createdat
      ORDER BY c.fullname
    `;
    const result = await db.query(query, [electionId]);
    
    // Map to camelCase for frontend compatibility
    const candidates = result.rows.map(row => ({
      candidateid: row.candidateid,
      fullname: row.fullname,
      partyname: row.partyname,
      electionid: row.electionid,
      votes: parseInt(row.votes) || 0,
      vote_count: parseInt(row.vote_count) || 0,
      bio: row.bio || '',
      photourl: row.photourl || '',
      createdat: row.createdat
    }));
    
    res.json(candidates);
  } catch (error) {
    console.error("Get candidates error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = `
      SELECT 
        c.*,
        COUNT(DISTINCT v.voteid) AS vote_count
      FROM candidates c
      LEFT JOIN votes v ON c.candidateid = v.candidateid
      WHERE c.candidateid = $1
      GROUP BY c.candidateid, c.fullname, c.partyname, c.electionid, c.votes, c.bio, c.photourl, c.createdat
    `;
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    
    const candidate = result.rows[0];
    res.json({
      candidateid: candidate.candidateid,
      fullname: candidate.fullname,
      partyname: candidate.partyname,
      electionid: candidate.electionid,
      votes: parseInt(candidate.votes) || 0,
      vote_count: parseInt(candidate.vote_count) || 0,
      bio: candidate.bio || '',
      photourl: candidate.photourl || '',
      createdat: candidate.createdat
    });
  } catch (error) {
    console.error("Get candidate error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create candidate (Admin only)
exports.createCandidate = async (req, res) => {
  try {
    const { ElectionID, FullName, PartyName, Bio, PhotoURL } = req.body;
    
    // PostgreSQL converts unquoted identifiers to lowercase
    // Schema only has: candidateid, fullname, partyname, electionid, votes, bio, photourl, createdat
    const query = `
      INSERT INTO candidates (electionid, fullname, partyname, bio, photourl)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      ElectionID,
      FullName,
      PartyName || null,
      Bio || null,
      PhotoURL || null
    ]);
    
    res.status(201).json({ 
      message: "Candidate created successfully",
      candidate: {
        candidateid: result.rows[0].candidateid,
        fullname: result.rows[0].fullname,
        partyname: result.rows[0].partyname,
        electionid: result.rows[0].electionid,
        votes: result.rows[0].votes || 0,
        bio: result.rows[0].bio || '',
        photourl: result.rows[0].photourl || '',
        createdat: result.rows[0].createdat
      }
    });
  } catch (error) {
    console.error("Create candidate error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Rate candidate (Note: CandidateRatings table doesn't exist in schema, returning placeholder)
exports.rateCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { voterId, rating, comment } = req.body;
    
    // CandidateRatings table doesn't exist in the current schema
    // This is a placeholder implementation
    res.status(501).json({ 
      error: "Rating functionality not yet implemented",
      message: "CandidateRatings table needs to be added to the database schema"
    });
  } catch (error) {
    console.error("Rate candidate error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get candidate ratings (Note: CandidateRatings table doesn't exist in schema)
exports.getCandidateRatings = async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    // CandidateRatings table doesn't exist in the current schema
    // Return empty array for now
    res.json([]);
  } catch (error) {
    console.error("Get ratings error:", error);
    res.status(500).json({ error: error.message });
  }
};

