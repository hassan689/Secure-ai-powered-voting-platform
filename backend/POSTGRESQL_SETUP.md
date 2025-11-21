# PostgreSQL Setup Guide

This guide will help you migrate from MSSQL to PostgreSQL.

## Prerequisites

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres-voting -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

## Step 1: Install PostgreSQL

### Windows:
- Download PostgreSQL installer from https://www.postgresql.org/download/windows/
- Run the installer and follow the setup wizard
- Remember your postgres user password

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Docker (Recommended):
```bash
docker run --name postgres-voting \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=voting_management \
  -p 5432:5432 \
  -d postgres
```

## Step 2: Create Database

Connect to PostgreSQL:
```bash
psql -U postgres
```

Or if using Docker:
```bash
docker exec -it postgres-voting psql -U postgres
```

Create the database:
```sql
CREATE DATABASE voting_management;
\q
```

## Step 3: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your PostgreSQL credentials:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=voting_management
DB_PASSWORD=your_password_here
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## Step 4: Run Database Migration

Run the migration script to create tables:
```bash
node database/migrate.js
```

Or manually run the SQL schema:
```bash
psql -U postgres -d voting_management -f database/schema.sql
```

## Step 5: Create Default Admin Account

The schema includes a default admin, but you should update the password:

```bash
node database/create-admin.js
```

Or manually in psql:
```sql
-- Generate a bcrypt hash for your password (use online tool or Node.js)
-- Example: password 'admin123' -> hash '$2a$10$...'

UPDATE Admins 
SET PasswordHash = '$2a$10$YourGeneratedHashHere' 
WHERE Username = 'admin';
```

## Step 6: Start the Backend Server

```bash
npm start
# or for development
npm run server
```

## Key Differences: MSSQL vs PostgreSQL

### Column Naming:
- PostgreSQL uses lowercase column names by default
- The code maps them to camelCase for frontend compatibility

### Query Syntax:
- MSSQL: `` sql.query`SELECT * FROM Table WHERE ID = ${id}` ``
- PostgreSQL: `db.query('SELECT * FROM Table WHERE ID = $1', [id])`

### Data Types:
- MSSQL `BIT` → PostgreSQL `BOOLEAN`
- MSSQL `INT IDENTITY` → PostgreSQL `SERIAL`
- MSSQL `NVARCHAR` → PostgreSQL `VARCHAR`

## Troubleshooting

### Connection Issues:
1. Check PostgreSQL is running: `pg_isready` or `docker ps`
2. Verify credentials in `.env` file
3. Check firewall settings (port 5432)

### Permission Issues:
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE voting_management TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

### Reset Database:
```sql
DROP DATABASE IF EXISTS voting_management;
CREATE DATABASE voting_management;
-- Then run migration again
```

## Testing the Connection

Create a test file `test-db.js`:
```javascript
const db = require('./config/db');

async function test() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connected!', result.rows[0]);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
  process.exit();
}

test();
```

Run: `node test-db.js`

## Production Considerations

1. **Use Environment Variables**: Never hardcode credentials
2. **Connection Pooling**: Already configured in `db.js`
3. **SSL Connection**: Enable SSL in production:
   ```javascript
   const dbConfig = {
     // ... other config
     ssl: {
       rejectUnauthorized: false // For self-signed certificates
     }
   };
   ```
4. **Backup**: Set up regular database backups
5. **Monitoring**: Use pgAdmin or similar tools for monitoring

## Useful PostgreSQL Commands

```sql
-- List all databases
\l

-- Connect to database
\c voting_management

-- List all tables
\dt

-- Describe table structure
\d Voters

-- View all data
SELECT * FROM Voters;

-- Exit psql
\q
```

## Need Help?

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Node.js pg library: https://node-postgres.com/

