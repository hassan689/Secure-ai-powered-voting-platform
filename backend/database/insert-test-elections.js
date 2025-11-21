const db = require('../config/db');

async function insertTestElections() {
  try {
    // Check if elections exist
    const countResult = await db.query('SELECT COUNT(*) FROM elections');
    const count = parseInt(countResult.rows[0].count);
    
    if (count > 0) {
      console.log(`✅ ${count} elections already exist in the database`);
      return;
    }
    
    console.log('📊 Inserting test elections...');
    
    // Insert test elections
    const insertQuery = `
      INSERT INTO elections (electionname, startdate, enddate, description, isactive) 
      VALUES 
        ('Student Council Election 2025', '2025-04-01', '2025-04-05', 'Annual student council election', TRUE),
        ('Department Representative Election', '2025-05-01', '2025-05-07', 'Department representative selection', FALSE)
      RETURNING *
    `;
    
    const result = await db.query(insertQuery);
    
    console.log(`✅ Successfully inserted ${result.rows.length} test elections:`);
    result.rows.forEach((election, index) => {
      console.log(`   ${index + 1}. ${election.electionname} (ID: ${election.electionid})`);
    });
    
  } catch (error) {
    console.error('❌ Error inserting test elections:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

insertTestElections();

