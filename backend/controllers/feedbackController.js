const db = require("../config/db");

// Submit feedback (Note: VoterFeedback table doesn't exist in schema)
exports.submitFeedback = async (req, res) => {
  try {
    // VoterFeedback table doesn't exist in the current schema
    // Log to audit_log instead
    const { voterId, electionId, feedbackType, subject, message } = req.body;
    
    if (voterId) {
      const auditQuery = `
        INSERT INTO audit_log (voterid, action)
        VALUES ($1, $2)
      `;
      await db.query(auditQuery, [
        voterId,
        `Feedback submitted: ${subject || feedbackType} - ${message?.substring(0, 100)}`
      ]);
    }
    
    res.status(201).json({ 
      message: "Feedback submitted successfully (logged to audit)",
      note: "VoterFeedback table needs to be added to the database schema for full functionality"
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all feedback (Admin) (Note: VoterFeedback table doesn't exist)
exports.getAllFeedback = async (req, res) => {
  try {
    // VoterFeedback table doesn't exist in schema
    res.json([]);
  } catch (error) {
    console.error("Get feedback error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update feedback status (Admin) (Note: VoterFeedback table doesn't exist)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    // VoterFeedback table doesn't exist in schema
    res.status(501).json({ 
      error: "Feedback functionality not yet implemented",
      message: "VoterFeedback table needs to be added to the database schema"
    });
  } catch (error) {
    console.error("Update feedback error:", error);
    res.status(500).json({ error: error.message });
  }
};

