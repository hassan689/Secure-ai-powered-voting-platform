-- Quick Setup Script for Voting Management Database
-- Run this in psql: psql -U postgres -d voting_management2 -f setup-database.sql

-- Create the database (run this separately if database doesn't exist)
-- CREATE DATABASE voting_management2;

-- Connect to voting_management2 and run the following:

-- Create tables
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

-- Create index
CREATE INDEX IF NOT EXISTS idx_pollingstations_location ON PollingStations(Latitude, Longitude);

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert sample admin (password: admin123)
INSERT INTO Admins (Username, PasswordHash, Role) 
VALUES ('admin', crypt('admin123', gen_salt('bf')), 'SuperAdmin')
ON CONFLICT (Username) DO NOTHING;

-- Insert sample voters (for testing)
INSERT INTO Voters (FullName, CNIC, Email, PasswordHash, IsVerified) 
VALUES 
('Test User', '12345-1234567-1', 'test@example.com', crypt('test123', gen_salt('bf')), TRUE)
ON CONFLICT (Email) DO NOTHING;

