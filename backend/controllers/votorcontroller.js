const db = require("../config/db");

exports.verifyVoter = async (req, res) => {
  const { VoterID } = req.params;
  
  try {
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = 'UPDATE voters SET isverified = $1 WHERE voterid = $2 RETURNING *';
    const result = await db.query(query, [true, VoterID]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Voter not found" });
    }

    res.json({ 
      message: "Voter verified successfully",
      voter: {
        VoterID: result.rows[0].voterid,
        FullName: result.rows[0].fullname,
        Email: result.rows[0].email,
        IsVerified: result.rows[0].isverified
      }
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createVoter = async (req, res) => {
  res.json({ message: "Voter created successfully." });
};

exports.getAllVoters = async (req, res) => {
  try {
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = 'SELECT voterid, fullname, cnic, email, isverified FROM voters ORDER BY voterid DESC';
    const result = await db.query(query);
    
    // Map lowercase column names to camelCase for frontend compatibility
    const voters = result.rows.map(row => ({
      VoterID: row.voterid,
      FullName: row.fullname,
      CNIC: row.cnic,
      Email: row.email,
      IsVerified: row.isverified ? 1 : 0 // Convert boolean to number for frontend compatibility
    }));

    res.json(voters);
  } catch (err) {
    console.error("Get voters error:", err);
    res.status(500).json({ error: err.message });
  }
};
