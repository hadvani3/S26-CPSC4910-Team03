-- use production dataset
USE Team03_DB;

-- create about page table
CREATE TABLE IF NOT EXISTS about_info (
	id INT PRIMARY KEY AUTO_INCREMENT,
    team_number VARCHAR(50) NOT NULL,
    version_number VARCHAR(50) NOT NULL,
    release_date DATE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_desc TEXT NOT NULL,
    is_curr BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- user table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_type VARCHAR(50) NOT NULL, -- driver, sponsor, admin
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- sponsors table 
CREATE TABLE IF NOT EXISTS sponsors (
	sponsor_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL UNIQUE,
    point_value_usd DECIMAL (10,4) NOT NULL DEFAULT 0.0100,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- drivers table
CREATE TABLE IF NOT EXISTS drivers (
	driver_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE, -- each driver has one login
    sponsor_id INT NOT NULL,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    phone_number VARCHAR(25),
    driver_status VARCHAR(25) NOT NULL DEFAULT 'PENDING',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- driver application table
CREATE TABLE IF NOT EXISTS driver_applications (
	application_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- applicant ID
    sponsor_id INT NOT NULL,  -- the sponsor the driver is applying to
    application_status VARCHAR(25) NOT NULL DEFAULT 'PENDING', -- pending, approved, denied
    notes VARCHAR(500),
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- driver points table
CREATE TABLE IF NOT EXISTS driver_points (
	transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    driver_id INT NOT NULL,
    sponsor_id INT NOT NULL,
    points_change INT NOT NULL, -- can be negative or positive
    reason VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- password reset table
CREATE TABLE IF NOT EXISTS reset_password_tokens (
	token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);