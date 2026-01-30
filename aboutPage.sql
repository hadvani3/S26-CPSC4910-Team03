-- reset table
USE driver_incentive;

-- remove table
DROP TABLE IF EXISTS about_info;

-- create a new table
CREATE TABLE about_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_number VARCHAR(50) NOT NULL,
    version_number VARCHAR(50) NOT NULL,
    release_date DATE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT NOT NULL,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- insert one row
INSERT INTO about_info 
    (team_number, version_number, release_date, product_name, product_description)
VALUES 
    ('Team 3', 'Sprint 3', curdate(), 'Good Driver Incentive Program', 
     'A comprehensive web-based incentive management system designed to reward truck drivers for safe driving behaviors. The platform connects drivers with sponsor companies who provide point-based rewards redeemable for products through integrated e-commerce APIs.');

-- check that there is only one row
SELECT COUNT(*) AS total_rows FROM about_info;
SELECT * FROM about_info;