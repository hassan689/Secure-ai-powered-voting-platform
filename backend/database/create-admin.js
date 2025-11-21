/**
 * Script to create or update admin account
 * Usage: node database/create-admin.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const readline = require('readline');
const db = require('../config/db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  try {
    console.log('=== Create Admin Account ===\n');
    
    rl.question('Enter username (default: admin): ', async (username) => {
      username = username || 'admin';
      
      rl.question('Enter password: ', async (password) => {
        if (!password) {
          console.error('Password is required!');
          rl.close();
          process.exit(1);
        }

        rl.question('Enter full name (optional): ', async (fullName) => {
          try {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Check if admin exists
            const checkQuery = 'SELECT * FROM Admins WHERE Username = $1';
            const existing = await db.query(checkQuery, [username]);

            if (existing.rows.length > 0) {
              // Update existing admin
              const updateQuery = `
                UPDATE Admins 
                SET PasswordHash = $1, FullName = $2, UpdatedAt = CURRENT_TIMESTAMP
                WHERE Username = $3
                RETURNING *
              `;
              const result = await db.query(updateQuery, [hashedPassword, fullName || username, username]);
              console.log('\n✅ Admin account updated successfully!');
              console.log('Username:', result.rows[0].username);
            } else {
              // Create new admin
              const insertQuery = `
                INSERT INTO Admins (Username, PasswordHash, FullName)
                VALUES ($1, $2, $3)
                RETURNING *
              `;
              const result = await db.query(insertQuery, [username, hashedPassword, fullName || username]);
              console.log('\n✅ Admin account created successfully!');
              console.log('AdminID:', result.rows[0].adminid);
              console.log('Username:', result.rows[0].username);
            }

            console.log('\n📝 You can now login with these credentials.');
          } catch (error) {
            console.error('\n❌ Error:', error.message);
          } finally {
            rl.close();
            process.exit(0);
          }
        });
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

createAdmin();

