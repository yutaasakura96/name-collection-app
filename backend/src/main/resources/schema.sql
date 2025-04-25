-- Create users table if it doesn't already exist
CREATE TABLE IF NOT EXISTS users (
    auth0_id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    last_login TIMESTAMP
);

-- Create names table if it doesn't already exist
CREATE TABLE IF NOT EXISTS names (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index on UUID for faster lookups
CREATE INDEX IF NOT EXISTS idx_names_uuid ON names(uuid);
