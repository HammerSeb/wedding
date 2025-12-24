-- Create the database
CREATE DATABASE IF NOT EXISTS `wedding`;

-- create table
CREATE TABLE wedding.guests (
    id UUID PRIMARY KEY,
    notcoming BOOLEAN,
    coming BOOLEAN,
    name VARCHAR(255),
    amount INTEGER,
    diet_norm INTEGER,
    diet_veggie INTEGER,
    diet_vegan INTEGER,
    comment TEXT
);
