const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.loginAdmin = async (req, res) => {
  const { Username, Password } = req.body;
  
  try {
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = 'SELECT * FROM admins WHERE username = $1';
    const result = await db.query(query, [Username]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const admin = result.rows[0];

    // Compare password (schema uses pgcrypto but we're using bcrypt)
    const isMatch = await bcrypt.compare(Password, admin.passwordhash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Admin login successful",
      admin: {
        AdminID: admin.adminid,
        Username: admin.username,
        Role: admin.role
      }
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: err.message });
  }
};
