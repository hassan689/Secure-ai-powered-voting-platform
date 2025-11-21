-- PostgreSQL Database Schema for Voting Management System

-- Create database (run this separately)
-- CREATE DATABASE voting_management;

-- Connect to the database and run the following:

-- Enable UUID extension (optional, if you want to use UUIDs)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Voters table
CREATE TABLE IF NOT EXISTS Voters (
    VoterID SERIAL PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    CNIC VARCHAR(20) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    IsVerified BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Admins table
CREATE TABLE IF NOT EXISTS Admins (
    AdminID SERIAL PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_voters_email ON Voters(Email);
CREATE INDEX IF NOT EXISTS idx_voters_cnic ON Voters(CNIC);
CREATE INDEX IF NOT EXISTS idx_voters_verified ON Voters(IsVerified);
CREATE INDEX IF NOT EXISTS idx_admins_username ON Admins(Username);

-- Note: Admin account should be created using create-admin.js script
-- Run: node database/create-admin.js
-- This ensures proper password hashing

-- Create a function to update UpdatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.UpdatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update UpdatedAt
CREATE TRIGGER update_voters_updated_at BEFORE UPDATE ON Voters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON Admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;

