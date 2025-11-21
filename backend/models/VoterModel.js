const db = require('../config/db'); 

exports.getAllVoters = async () => {
  const result = await db.query('SELECT * FROM Voters ORDER BY VoterID DESC');
  return result.rows;
};

exports.getVoterById = async (id) => {
  const result = await db.query('SELECT * FROM Voters WHERE VoterID = $1', [id]);
  return result.rows[0];
};

exports.createVoter = async (name, email) => {
  const result = await db.query(
    'INSERT INTO Voters (FullName, Email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  return result.rows[0];
};

exports.updateVoter = async (id, name, email) => {
  const result = await db.query(
    'UPDATE Voters SET FullName = $1, Email = $2 WHERE VoterID = $3 RETURNING *',
    [name, email, id]
  );
  return result.rows[0];
};

exports.deleteVoter = async (id) => {
  const result = await db.query('DELETE FROM Voters WHERE VoterID = $1 RETURNING *', [id]);
  return result.rows[0];
};

