/**
 * Script to create test data for development/testing
 * Usage: node database/create-test-data.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function createTestData() {
  try {
    console.log('🧪 Creating test data...\n');

    // Test Voter Credentials
    const testVoter = {
      FullName: 'Test Voter',
      CNIC: '12345-1234567-1',
      Email: 'test@example.com',
      Password: 'test123'
    };

    // Test Admin Credentials
    const testAdmin = {
      Username: 'admin',
      Password: 'admin123',
      FullName: 'Test Admin'
    };

    // Create test voter
    try {
      const hashedVoterPassword = await bcrypt.hash(testVoter.Password, 10);
      
      // Check if voter exists
      const voterCheck = await db.query(
        'SELECT * FROM Voters WHERE Email = $1 OR CNIC = $2',
        [testVoter.Email, testVoter.CNIC]
      );

      if (voterCheck.rows.length > 0) {
        console.log('ℹ️  Test voter already exists, updating...');
        await db.query(
          'UPDATE Voters SET PasswordHash = $1, FullName = $2 WHERE Email = $3',
          [hashedVoterPassword, testVoter.FullName, testVoter.Email]
        );
        console.log('✅ Test voter updated!');
      } else {
        await db.query(
          'INSERT INTO Voters (FullName, CNIC, Email, PasswordHash, IsVerified) VALUES ($1, $2, $3, $4, $5)',
          [testVoter.FullName, testVoter.CNIC, testVoter.Email, hashedVoterPassword, false]
        );
        console.log('✅ Test voter created!');
      }

      console.log(`   Email: ${testVoter.Email}`);
      console.log(`   Password: ${testVoter.Password}`);
      console.log(`   CNIC: ${testVoter.CNIC}\n`);
    } catch (error) {
      console.error('❌ Error creating test voter:', error.message);
    }

    // Create test admin
    try {
      const hashedAdminPassword = await bcrypt.hash(testAdmin.Password, 10);
      
      // Check if admin exists
      const adminCheck = await db.query(
        'SELECT * FROM Admins WHERE Username = $1',
        [testAdmin.Username]
      );

      if (adminCheck.rows.length > 0) {
        console.log('ℹ️  Test admin already exists, updating...');
        await db.query(
          'UPDATE Admins SET PasswordHash = $1, FullName = $2 WHERE Username = $3',
          [hashedAdminPassword, testAdmin.FullName, testAdmin.Username]
        );
        console.log('✅ Test admin updated!');
      } else {
        await db.query(
          'INSERT INTO Admins (Username, PasswordHash, FullName) VALUES ($1, $2, $3)',
          [testAdmin.Username, hashedAdminPassword, testAdmin.FullName]
        );
        console.log('✅ Test admin created!');
      }

      console.log(`   Username: ${testAdmin.Username}`);
      console.log(`   Password: ${testAdmin.Password}\n`);
    } catch (error) {
      console.error('❌ Error creating test admin:', error.message);
    }

    // Create additional test voters
    const additionalVoters = [
      {
        FullName: 'John Doe',
        CNIC: '11111-1111111-1',
        Email: 'john@example.com',
        Password: 'password123',
        IsVerified: true
      },
      {
        FullName: 'Jane Smith',
        CNIC: '22222-2222222-2',
        Email: 'jane@example.com',
        Password: 'password123',
        IsVerified: false
      },
      {
        FullName: 'Bob Johnson',
        CNIC: '33333-3333333-3',
        Email: 'bob@example.com',
        Password: 'password123',
        IsVerified: true
      }
    ];

    console.log('📝 Creating additional test voters...');
    for (const voter of additionalVoters) {
      try {
        const hashedPassword = await bcrypt.hash(voter.Password, 10);
        const check = await db.query(
          'SELECT * FROM Voters WHERE Email = $1',
          [voter.Email]
        );

        if (check.rows.length === 0) {
          await db.query(
            'INSERT INTO Voters (FullName, CNIC, Email, PasswordHash, IsVerified) VALUES ($1, $2, $3, $4, $5)',
            [voter.FullName, voter.CNIC, voter.Email, hashedPassword, voter.IsVerified]
          );
          console.log(`   ✅ Created: ${voter.Email}`);
        } else {
          console.log(`   ⏭️  Skipped (exists): ${voter.Email}`);
        }
      } catch (error) {
        console.error(`   ❌ Error creating ${voter.Email}:`, error.message);
      }
    }

    console.log('\n✨ Test data setup complete!\n');
    console.log('📋 Test Credentials Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('VOTER LOGIN:');
    console.log('  Email: test@example.com');
    console.log('  Password: test123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ADMIN LOGIN:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await db.pool.end();
  }
}

createTestData();

