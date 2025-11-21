# Database Setup Instructions

## Quick Setup

Your database `voting_management2` exists but tables are missing. Follow these steps:

### Option 1: Using psql Command Line

```bash
# Connect to PostgreSQL
psql -U postgres -d voting_management2

# Run the schema file
\i database/schema_complete.sql

# Or run the quick setup
\i database/setup-database.sql
```

### Option 2: Using psql with file

```bash
psql -U postgres -d voting_management2 -f database/setup-database.sql
```

### Option 3: Copy and paste SQL

1. Open `database/schema_complete.sql`
2. Copy all the SQL
3. Connect to PostgreSQL: `psql -U postgres -d voting_management2`
4. Paste and run

## Verify Tables Created

After running the schema, verify tables exist:

```sql
\dt
```

You should see:
- Admins
- Elections
- Voters
- Candidates
- Votes
- Results
- Audit_Log
- PollingStations

## Test Connection

After creating tables, restart your backend server:

```bash
npm start
```

The registration should now work!

## Important Notes

- The schema uses **PascalCase** identifiers (VoterID, FullName, etc.)
- All queries use **quoted identifiers** to preserve case: `"VoterID"`, `"Email"`, etc.
- Password hashing: Schema uses `pgcrypto` but controllers use `bcrypt` (both work)

