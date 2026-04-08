-- use production dataset
USE Team03_DB;

-- insert about page info
INSERT INTO about_info (
team_number,
version_number,
release_date,
product_name,
product_desc,
is_curr
)

SELECT 
	'Team 3',
    'Sprint 9',
    CURDATE(),
    'Good Driver Incentive Program',
    'Sprint 9 Changes - Implemented bulk upload feature for admin and sponsor users, audit logging with login attempts, point changes and application tracking. Admin and sponsor reports are available with CSV export option.',
    TRUE

WHERE NOT EXISTS (
	SELECT 1
    FROM about_info
    WHERE team_number = 'Team 3' AND version_number = 'Sprint 9'
);

-- ensure that only Sprint 9 data is inserted as current version
UPDATE about_info
SET is_curr = (version_number = 'Sprint 9')
WHERE team_number = 'Team 3';
    