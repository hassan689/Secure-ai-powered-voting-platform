const db = require("../config/db");

// Get all elections
exports.getAllElections = async (req, res) => {
  try {
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = `
      SELECT 
        e.electionid,
        e.electionname,
        e.startdate,
        e.enddate,
        e.description,
        e.isactive,
        e.createdat,
        COUNT(DISTINCT c.candidateid) AS candidate_count,
        COUNT(DISTINCT v.voteid) AS vote_count,
        CASE 
          WHEN e.enddate < CURRENT_DATE THEN 'ended'
          WHEN e.startdate <= CURRENT_DATE AND e.enddate >= CURRENT_DATE THEN 'active'
          WHEN e.startdate > CURRENT_DATE THEN 'upcoming'
          ELSE 'unknown'
        END AS status
      FROM elections e
      LEFT JOIN candidates c ON e.electionid = c.electionid
      LEFT JOIN votes v ON e.electionid = v.electionid
      GROUP BY e.electionid, e.electionname, e.startdate, e.enddate, e.description, e.isactive, e.createdat
      ORDER BY e.startdate DESC
    `;
    const result = await db.query(query);
    
    // Map to camelCase for frontend
    const elections = result.rows.map(row => ({
      electionid: row.electionid,
      title: row.electionname, // Map ElectionName to title for frontend compatibility
      electionname: row.electionname,
      startdate: row.startdate,
      enddate: row.enddate,
      description: row.description || '',
      isactive: row.isactive,
      createdat: row.createdat,
      candidate_count: parseInt(row.candidate_count) || 0,
      vote_count: parseInt(row.vote_count) || 0,
      status: row.status
    }));
    
    res.json(elections);
  } catch (error) {
    console.error("Get elections error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get active elections
exports.getActiveElections = async (req, res) => {
  try {
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = `
      SELECT 
        e.electionid,
        e.electionname,
        e.startdate,
        e.enddate,
        e.description,
        e.isactive,
        e.createdat,
        COUNT(DISTINCT c.candidateid) AS candidate_count,
        COUNT(DISTINCT v.voteid) AS vote_count,
        'active' AS status
      FROM elections e
      LEFT JOIN candidates c ON e.electionid = c.electionid
      LEFT JOIN votes v ON e.electionid = v.electionid
      WHERE e.isactive = TRUE 
        AND e.startdate <= CURRENT_DATE 
        AND e.enddate >= CURRENT_DATE
      GROUP BY e.electionid, e.electionname, e.startdate, e.enddate, e.description, e.isactive, e.createdat
      ORDER BY e.startdate DESC
    `;
    const result = await db.query(query);
    
    // Map to camelCase for frontend
    const elections = result.rows.map(row => ({
      electionid: row.electionid,
      title: row.electionname, // Map ElectionName to title for frontend compatibility
      electionname: row.electionname,
      startdate: row.startdate,
      enddate: row.enddate,
      description: row.description || '',
      isactive: row.isactive,
      createdat: row.createdat,
      candidate_count: parseInt(row.candidate_count) || 0,
      vote_count: parseInt(row.vote_count) || 0,
      status: row.status
    }));
    
    res.json(elections);
  } catch (error) {
    console.error("Get active elections error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get election by ID
exports.getElectionById = async (req, res) => {
  try {
    const { id } = req.params;
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = `
      SELECT 
        e.*,
        COUNT(DISTINCT c.candidateid) AS candidate_count,
        COUNT(DISTINCT v.voteid) AS vote_count,
        CASE 
          WHEN e.enddate < CURRENT_DATE THEN 'ended'
          WHEN e.startdate <= CURRENT_DATE AND e.enddate >= CURRENT_DATE THEN 'active'
          WHEN e.startdate > CURRENT_DATE THEN 'upcoming'
          ELSE 'unknown'
        END AS status
      FROM elections e
      LEFT JOIN candidates c ON e.electionid = c.electionid
      LEFT JOIN votes v ON e.electionid = v.electionid
      WHERE e.electionid = $1
      GROUP BY e.electionid, e.electionname, e.startdate, e.enddate, e.description, e.isactive, e.createdat
    `;
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Election not found" });
    }
    
    const election = result.rows[0];
    // Map to camelCase for frontend
    res.json({
      electionid: election.electionid,
      title: election.electionname,
      electionname: election.electionname,
      startdate: election.startdate,
      enddate: election.enddate,
      description: election.description || '',
      isactive: election.isactive,
      createdat: election.createdat,
      candidate_count: parseInt(election.candidate_count) || 0,
      vote_count: parseInt(election.vote_count) || 0,
      status: election.status
    });
  } catch (error) {
    console.error("Get election error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create election (Admin only)
exports.createElection = async (req, res) => {
  try {
    const { Title, Description, ElectionType, StartDate, EndDate, CreatedBy } = req.body;
    
    const query = `
      INSERT INTO Elections (Title, Description, ElectionType, StartDate, EndDate, Status, CreatedBy)
      VALUES ($1, $2, $3, $4, $5, 'upcoming', $6)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      Title,
      Description,
      ElectionType,
      StartDate,
      EndDate,
      CreatedBy
    ]);
    
    res.status(201).json({ 
      message: "Election created successfully",
      election: result.rows[0]
    });
  } catch (error) {
    console.error("Create election error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update election status
exports.updateElectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { Status } = req.body;
    
    const query = `
      UPDATE Elections 
      SET Status = $1, UpdatedAt = CURRENT_TIMESTAMP
      WHERE ElectionID = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [Status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Election not found" });
    }
    
    res.json({ 
      message: "Election status updated",
      election: result.rows[0]
    });
  } catch (error) {
    console.error("Update election error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Publish results
exports.publishResults = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      UPDATE Elections 
      SET IsResultsPublished = TRUE, UpdatedAt = CURRENT_TIMESTAMP
      WHERE ElectionID = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Election not found" });
    }
    
    res.json({ 
      message: "Results published successfully",
      election: result.rows[0]
    });
  } catch (error) {
    console.error("Publish results error:", error);
    res.status(500).json({ error: error.message });
  }
};

