-- 1. CREATE THE DATABASE (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS freshcart_db;

-- 2. USE THE NEW DATABASE
USE freshcart_db;

-- 3. CREATE THE USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    roll_number VARCHAR(15) UNIQUE NOT NULL,
    -- In a real app, this would store a long HASH (e.g., 60-100 characters)
    password_hash VARCHAR(100) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. INSERT SAMPLE DATA
-- The 'password_hash' column below uses the plain text passwords for reference
-- but in reality, you would insert the output of a secure hashing function.
INSERT INTO users (username, roll_number, password_hash) VALUES
('priyanshu.m', '2401430100187', 'p187_hashed_value'),
('priyanshu.r', '2401430100188', 'p188_hashed_value'),
('sarbik', '2401430100216', 's216_hashed_value'),
('shiv', '2401430100224', 's224_hashed_value'),
('utkarsh', '2401430100262', 'u262_hashed_value');

-- 5. OPTIONAL: VIEW THE TABLE
SELECT * FROM users;