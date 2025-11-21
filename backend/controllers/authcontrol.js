const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email (simplified - configure with your email service)
async function sendOTPEmail(email, otp) {
  // TODO: Configure nodemailer with your email service
  // For now, just log it for testing
  console.log(`\n📧 ========================================`);
  console.log(`📧 TEST OTP EMAIL`);
  console.log(`📧 ========================================`);
  console.log(`📧 To: ${email}`);
  console.log(`📧 OTP Code: ${otp}`);
  console.log(`📧 ========================================\n`);
  return true;
}

exports.registerVoter = async (req, res) => {
  const { FullName, CNIC, Email, Password } = req.body;
  
  try {
    // Check if voter already exists (PostgreSQL converts unquoted identifiers to lowercase)
    const checkQuery = 'SELECT * FROM voters WHERE cnic = $1 OR email = $2';
    const existingVoter = await db.query(checkQuery, [CNIC, Email]);
    
    if (existingVoter.rows.length > 0) {
      return res.status(400).json({ error: "Voter already exists" });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(Password, 10);
    
    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Insert new voter with OTP (PostgreSQL converts unquoted identifiers to lowercase)
    const insertQuery = `
      INSERT INTO voters (fullname, cnic, email, passwordhash, isverified, emailverified, otpcode, otpexpiry)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING voterid, fullname, email, isverified, emailverified, otpcode
    `;
    
    const result = await db.query(insertQuery, [
      FullName,
      CNIC,
      Email,
      hashedPassword,
      false, // IsVerified defaults to false (admin verification)
      false, // EmailVerified defaults to false (OTP verification)
      otp,
      otpExpiry
    ]);

    // Log OTP for testing (in production, send via email)
    console.log(`\n📧 TEST OTP for ${Email}: ${otp}`);
    console.log(`⏰ OTP expires at: ${otpExpiry.toLocaleString()}\n`);

    // Send OTP email (for testing, it just logs)
    await sendOTPEmail(Email, otp);

    res.status(201).json({ 
      message: "Voter registered successfully! Please verify your email with the OTP sent.",
      voter: {
        VoterID: result.rows[0].voterid,
        FullName: result.rows[0].fullname,
        Email: result.rows[0].email,
        IsVerified: result.rows[0].isverified,
        EmailVerified: result.rows[0].emailverified
      },
      // Include OTP in response for testing (remove in production)
      testOTP: otp,
      otpSent: true
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { Email, OTPCode } = req.body;
  
  try {
    const query = 'SELECT * FROM voters WHERE email = $1';
    const result = await db.query(query, [Email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Voter not found" });
    }
    
    const voter = result.rows[0];
    
    // Check if email is already verified
    if (voter.emailverified) {
      return res.status(400).json({ error: "Email already verified" });
    }
    
    // Check if OTP exists
    if (!voter.otpcode) {
      return res.status(400).json({ error: "No OTP found. Please request a new OTP." });
    }
    
    // Verify OTP code
    if (voter.otpcode !== OTPCode) {
      return res.status(400).json({ error: "Invalid OTP code" });
    }
    
    // Check if OTP has expired
    if (voter.otpexpiry && new Date(voter.otpexpiry) < new Date()) {
      return res.status(400).json({ error: "OTP code has expired. Please request a new one." });
    }
    
    // Update voter as email verified and clear OTP
    const updateQuery = `
      UPDATE voters 
      SET emailverified = TRUE, otpcode = NULL, otpexpiry = NULL
      WHERE email = $1
      RETURNING voterid, fullname, email, isverified, emailverified
    `;
    
    const updateResult = await db.query(updateQuery, [Email]);
    
    res.json({ 
      message: "Email verified successfully!",
      voter: {
        VoterID: updateResult.rows[0].voterid,
        FullName: updateResult.rows[0].fullname,
        Email: updateResult.rows[0].email,
        IsVerified: updateResult.rows[0].isverified,
        EmailVerified: updateResult.rows[0].emailverified
      }
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  const { Email } = req.body;
  
  try {
    const query = 'SELECT * FROM voters WHERE email = $1';
    const result = await db.query(query, [Email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Voter not found" });
    }
    
    const voter = result.rows[0];
    
    // Check if email is already verified
    if (voter.emailverified) {
      return res.status(400).json({ error: "Email already verified" });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Update OTP in database
    const updateQuery = `
      UPDATE voters 
      SET otpcode = $1, otpexpiry = $2
      WHERE email = $3
    `;
    await db.query(updateQuery, [otp, otpExpiry, Email]);
    
    // Log OTP for testing (in production, send via email)
    console.log(`\n📧 TEST OTP (RESENT) for ${Email}: ${otp}`);
    console.log(`⏰ OTP expires at: ${otpExpiry.toLocaleString()}\n`);
    
    // Send OTP email
    await sendOTPEmail(Email, otp);
    
    res.json({ 
      message: "OTP resent successfully",
      // Include OTP in response for testing (remove in production)
      testOTP: otp,
      otpSent: true
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.loginVoter = async (req, res) => {
  const { Email, Password } = req.body;
  
  try {
    // Find voter by email (PostgreSQL converts unquoted identifiers to lowercase)
    const query = 'SELECT * FROM voters WHERE email = $1';
    const result = await db.query(query, [Email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Voter not found" });
    }

    const voter = result.rows[0];

    // Compare password (schema uses pgcrypto but we're using bcrypt)
    const isMatch = await bcrypt.compare(Password, voter.passwordhash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { VoterID: voter.voterid },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      voter: {
        VoterID: voter.voterid,
        FullName: voter.fullname,
        Email: voter.email,
        IsVerified: voter.isverified
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};
