-- Create the database (run this separately in psql or admin tool)
-- CREATE DATABASE voting_management2;

-- Connect to the database and create tables
CREATE TABLE IF NOT EXISTS Admins (
    AdminID SERIAL PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    Role VARCHAR(50) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Elections (
    ElectionID SERIAL PRIMARY KEY,
    ElectionName VARCHAR(100) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Description TEXT,
    IsActive BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Voters (
    VoterID SERIAL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    CNIC VARCHAR(15) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    IsVerified BOOLEAN DEFAULT FALSE,
    EmailVerified BOOLEAN DEFAULT FALSE,
    OTPCode VARCHAR(6),
    OTPExpiry TIMESTAMP,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Candidates (
    CandidateID SERIAL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    PartyName VARCHAR(100),
    ElectionID INT REFERENCES Elections(ElectionID),
    Votes INT DEFAULT 0,
    Bio TEXT,
    PhotoURL TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Votes (
    VoteID SERIAL PRIMARY KEY,
    VoterID INT REFERENCES Voters(VoterID),
    CandidateID INT REFERENCES Candidates(CandidateID),
    ElectionID INT REFERENCES Elections(ElectionID),
    VoteTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IPAddress VARCHAR(45),
    CONSTRAINT unique_voter_election UNIQUE (VoterID, ElectionID)
);

CREATE TABLE IF NOT EXISTS Results (
    ResultID SERIAL PRIMARY KEY,
    ElectionID INT REFERENCES Elections(ElectionID),
    CandidateID INT REFERENCES Candidates(CandidateID),
    VoteCount INT DEFAULT 0,
    Percentage DECIMAL(5,2),
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Audit_Log (
    LogID SERIAL PRIMARY KEY,
    VoterID INT REFERENCES Voters(VoterID),
    AdminID INT REFERENCES Admins(AdminID),
    Action TEXT NOT NULL,
    ActionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IPAddress VARCHAR(45)
);

CREATE TABLE IF NOT EXISTS PollingStations (
    StationID SERIAL PRIMARY KEY,
    StationName VARCHAR(100) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    City VARCHAR(50) NOT NULL,
    State VARCHAR(50) NOT NULL,
    ZipCode VARCHAR(20) NOT NULL,
    Latitude DECIMAL(10, 8) NOT NULL,
    Longitude DECIMAL(11, 8) NOT NULL,
    OpeningTime TIME NOT NULL,
    ClosingTime TIME NOT NULL,
    Accessibility BOOLEAN DEFAULT FALSE,
    Capacity INT,
    ContactPhone VARCHAR(20),
    AdditionalNotes TEXT,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_pollingstations_location ON PollingStations(Latitude, Longitude);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert sample data
INSERT INTO Admins (Username, PasswordHash, Role) VALUES 
('admin1', crypt('password123', gen_salt('bf')), 'SuperAdmin'),
('admin2', crypt('securepass', gen_salt('bf')), 'Moderator');

INSERT INTO Elections (ElectionName, StartDate, EndDate) VALUES 
('Student Council Election 2025', '2025-04-01', '2025-04-05'),
('Department Representative Election', '2025-05-01', '2025-05-07');

INSERT INTO Voters (FullName, CNIC, Email, PasswordHash, IsVerified) VALUES 
('Ali Khan', '12345-8789012-3', 'ali.khan@example.com', crypt('SecurePass123', gen_salt('bf')), FALSE),
('John Doe', '12345-6789012-3', 'john@example.com', crypt('johnpass', gen_salt('bf')), TRUE),
('Alice Smith', '98765-4321098-7', 'alice@example.com', crypt('alicepass', gen_salt('bf')), TRUE),
('Bob Johnson', '11223-4455667-8', 'bob@example.com', crypt('bobpass', gen_salt('bf')), FALSE);

INSERT INTO Candidates (FullName, PartyName, ElectionID) VALUES 
('Michael Brown', 'Youth Alliance', 1),
('Sophia White', 'Progressive Student Union', 1),
('David Lee', 'Science Enthusiasts', 2),
('Emma Garcia', 'Tech Innovators', 2),
('Rayyan', 'PTI', 1),
('Fahad', 'PTI', 1),
('Cheeky', 'PTI', 1);

INSERT INTO PollingStations (
    StationName, Address, City, State, ZipCode, 
    Latitude, Longitude, OpeningTime, ClosingTime,
    Accessibility, Capacity, ContactPhone
) VALUES 
('Central High School', '123 Education Blvd', 'Metropolis', 'NY', '10001', 
 40.712800, -74.006000, '07:00:00', '19:00:00', 
 TRUE, 500, '212-555-1001'),
('Community Center', '456 Civic Way', 'Metropolis', 'NY', '10002', 
 40.715500, -74.008200, '06:00:00', '20:00:00', 
 TRUE, 300, '212-555-1002'),
('Public Library', '789 Knowledge Lane', 'Metropolis', 'NY', '10003', 
 40.710300, -74.003500, '08:00:00', '18:00:00', 
 FALSE, 200, '212-555-1003');

-- Register a new voter function
-- Verify voter login function (corrected version)
CREATE OR REPLACE FUNCTION verify_voter_login(
    p_email VARCHAR(100),
    p_password VARCHAR(100)
)
RETURNS TABLE (
    voter_id INT,
    full_name VARCHAR(100),
    email VARCHAR(100),
    is_verified BOOLEAN,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.VoterID,
        v.FullName,
        v.Email,
        v.IsVerified,
        v.CreatedAt
    FROM Voters v
    WHERE v.Email = p_email 
    AND v.PasswordHash = crypt(p_password, v.PasswordHash)
    AND v.IsVerified = TRUE;
    
    IF NOT FOUND THEN
        INSERT INTO Audit_Log (Action) 
        VALUES ('Failed login attempt for email: ' || p_email);
        
        RAISE EXCEPTION 'Invalid credentials or account not verified';
    ELSE
        INSERT INTO Audit_Log (VoterID, Action) 
        VALUES ((SELECT VoterID FROM Voters WHERE Email = p_email), 'Successful login');
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Cast a vote function
CREATE OR REPLACE FUNCTION cast_vote(
    p_voter_id INT,
    p_candidate_id INT,
    p_election_id INT)
RETURNS TEXT AS $$
DECLARE
    v_already_voted BOOLEAN;
BEGIN
    -- Check if voter already voted in this election
    SELECT EXISTS (
        SELECT 1 FROM Votes 
        WHERE VoterID = p_voter_id 
        AND ElectionID = p_election_id
    ) INTO v_already_voted;
    
    IF v_already_voted THEN
        INSERT INTO Audit_Log (VoterID, Action)
        VALUES (p_voter_id, 'Attempted to vote again in election ' || p_election_id);
        RETURN 'Error: You have already voted in this election!';
    END IF;
    
    -- Check if voter is verified
    IF NOT (SELECT IsVerified FROM Voters WHERE VoterID = p_voter_id) THEN
        INSERT INTO Audit_Log (VoterID, Action)
        VALUES (p_voter_id, 'Attempted to vote without verification');
        RETURN 'Error: Your account is not verified!';
    END IF;
    
    -- Insert the vote
    INSERT INTO Votes (VoterID, CandidateID, ElectionID)
    VALUES (p_voter_id, p_candidate_id, p_election_id);
    
    -- Update candidate vote count
    UPDATE Candidates 
    SET Votes = Votes + 1 
    WHERE CandidateID = p_candidate_id;
    
    -- Log the action
    INSERT INTO Audit_Log (VoterID, Action)
    VALUES (p_voter_id, 'Voted for candidate ' || p_candidate_id || ' in election ' || p_election_id);
    
    RETURN 'Vote cast successfully!';
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Get election results function
CREATE OR REPLACE FUNCTION get_election_results(p_election_id INT)
RETURNS TABLE (
    candidate_id INT,
    candidate_name VARCHAR(100),
    party_name VARCHAR(100),
    total_votes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.CandidateID,
        c.FullName,
        c.PartyName,
        COUNT(v.VoteID)::BIGINT AS TotalVotes
    FROM Candidates c
    LEFT JOIN Votes v ON c.CandidateID = v.CandidateID
    WHERE c.ElectionID = p_election_id
    GROUP BY c.CandidateID, c.FullName, c.PartyName
    ORDER BY TotalVotes DESC;
END;
$$ LANGUAGE plpgsql;

-- Log action function
CREATE OR REPLACE FUNCTION log_action(
    p_action TEXT,
    p_voter_id INT DEFAULT NULL,
    p_admin_id INT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    INSERT INTO Audit_Log (VoterID, AdminID, Action) 
    VALUES (p_voter_id, p_admin_id, p_action);
END;
$$ LANGUAGE plpgsql;

-- Verify voter procedure
CREATE OR REPLACE FUNCTION verify_voter(p_voter_id INT)
RETURNS TEXT AS $$
BEGIN
    UPDATE Voters 
    SET IsVerified = TRUE 
    WHERE VoterID = p_voter_id;
    
    PERFORM log_action('Voter ' || p_voter_id || ' verified', p_voter_id, NULL);
    
    RETURN 'Voter verified successfully!';
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Views
CREATE OR REPLACE VIEW verified_voters AS
SELECT VoterID, FullName, CNIC, Email, CreatedAt
FROM Voters
WHERE IsVerified = TRUE;

CREATE OR REPLACE VIEW election_summary AS
SELECT 
    e.ElectionID,
    e.ElectionName,
    e.StartDate,
    e.EndDate,
    COUNT(v.VoteID) AS TotalVotes
FROM Elections e
LEFT JOIN Votes v ON e.ElectionID = v.ElectionID
GROUP BY e.ElectionID, e.ElectionName, e.StartDate, e.EndDate;

CREATE OR REPLACE VIEW votes_per_candidate AS
SELECT 
    c.CandidateID,
    c.FullName AS CandidateName,
    c.PartyName,
    e.ElectionName,
    COUNT(v.VoteID) AS TotalVotes
FROM Candidates c
JOIN Elections e ON c.ElectionID = e.ElectionID
LEFT JOIN Votes v ON c.CandidateID = v.CandidateID
GROUP BY c.CandidateID, c.FullName, c.PartyName, e.ElectionName;

CREATE OR REPLACE VIEW voters_who_voted AS
SELECT DISTINCT v.VoterID, v.FullName, v.Email 
FROM Voters v
WHERE v.VoterID IN (SELECT DISTINCT VoterID FROM Votes);

CREATE OR REPLACE VIEW party_vote_count AS
SELECT c.PartyName, COUNT(v.VoteID) AS TotalVotes
FROM Candidates c
LEFT JOIN Votes v ON c.CandidateID = v.CandidateID
GROUP BY c.PartyName;

-- Admin access function
CREATE OR REPLACE FUNCTION get_admin_access(p_admin_id INT)
RETURNS TABLE (
    data_type TEXT,
    data JSONB
) AS $$
BEGIN
    -- Check if admin has super admin privileges
    IF NOT EXISTS (SELECT 1 FROM Admins WHERE AdminID = p_admin_id AND Role = 'SuperAdmin') THEN
        RAISE EXCEPTION 'Access Denied: You do not have admin privileges';
    END IF;
    
    -- Return voter details
    RETURN QUERY
    SELECT 'voters' AS data_type, jsonb_agg(to_jsonb(v)) AS data
    FROM Voters v;
    
    RETURN QUERY
    SELECT 'elections' AS data_type, jsonb_agg(to_jsonb(e)) AS data
    FROM Elections e;
    
    RETURN QUERY
    SELECT 'candidates_and_votes' AS data_type, 
           jsonb_agg(jsonb_build_object(
               'candidate_id', c.CandidateID,
               'full_name', c.FullName,
               'party_name', c.PartyName,
               'election_id', v.ElectionID,
               'total_votes', COUNT(v.VoteID)
           )) AS data
    FROM Candidates c
    LEFT JOIN Votes v ON c.CandidateID = v.CandidateID
    GROUP BY c.CandidateID, c.FullName, c.PartyName, v.ElectionID;
END;
$$ LANGUAGE plpgsql;

-- Admin login function
CREATE OR REPLACE FUNCTION admin_login(
    p_username VARCHAR(100),
    p_password VARCHAR(100))
RETURNS TABLE (
    admin_id INT,
    username VARCHAR(100),
    role VARCHAR(50),
    last_login TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.AdminID,
        a.Username,
        a.Role,
        a.LastLogin
    FROM Admins a
    WHERE a.Username = p_username 
    AND a.PasswordHash = crypt(p_password, a.PasswordHash);
    
    IF NOT FOUND THEN
        PERFORM log_action('Failed admin login attempt for ' || p_username, NULL, NULL);
        RAISE EXCEPTION 'Invalid admin credentials';
    ELSE
        UPDATE Admins 
        SET LastLogin = CURRENT_TIMESTAMP 
        WHERE Username = p_username;
        
        PERFORM log_action('Admin logged in', NULL, (SELECT AdminID FROM Admins WHERE Username = p_username));
    END IF;
END;
$$ LANGUAGE plpgsql;
