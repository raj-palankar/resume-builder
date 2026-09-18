 -- database/schema.sql
CREATE DATABASE IF NOT EXISTS resume_builder;
USE resume_builder;

CREATE TABLE IF NOT EXISTS resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    skills TEXT,
    education TEXT,
    experience TEXT,
    projects TEXT,
    social_linkedin VARCHAR(255),
    social_github VARCHAR(255),
    profile_photo LONGBLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
