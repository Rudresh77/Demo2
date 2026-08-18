-- Create Database
CREATE DATABASE IF NOT EXISTS demodb;
USE demodb;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Dummy Data
INSERT INTO users (username, email) VALUES 
('admin_user', 'admin@example.com'),
('alice_demo', 'alice@example.com'),
('bob_test', 'bob@example.com')
ON DUPLICATE KEY UPDATE email=email;
