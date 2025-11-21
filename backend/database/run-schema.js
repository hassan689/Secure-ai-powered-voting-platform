const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'voting_management2',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function runSchema() {
  const client = await pool.connect();
  
  try {
    console.log('📊 Reading schema file...');
    const schemaPath = path.join(__dirname, 'schema_complete.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🚀 Running schema...');
    await client.query(schemaSQL);
    
    console.log('✅ Schema executed successfully!');
    console.log('📋 Tables created:');
    console.log('   - Admins');
    console.log('   - Elections');
    console.log('   - Voters');
    console.log('   - Candidates');
    console.log('   - Votes');
    console.log('   - Results');
    console.log('   - Audit_Log');
    console.log('   - PollingStations');
    console.log('   - Functions and Views');
    
    // Verify tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📊 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error running schema:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSchema();

