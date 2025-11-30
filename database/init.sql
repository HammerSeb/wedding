-- Create the database
CREATE DATABASE IF NOT EXISTS `wedding`;

-- create table
CREATE TABLE wedding.guests (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    amount INTEGER,
    diet VARCHAR(100),
    comment TEXT,
    coming BOOLEAN
);
