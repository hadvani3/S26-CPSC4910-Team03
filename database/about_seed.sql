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
    'Sprint 7',
    CURDATE(),
    'Good Driver Incentive Program',
    'Sprint 7 Changes - Implemented core features for drivers, sponsors and admin users. Product catalog is also functional. ',
    TRUE

WHERE NOT EXISTS (
	SELECT 1
    FROM about_info
    WHERE team_number = 'Team 3' AND version_number = 'Sprint 7'
);

-- ensure that only Sprint 7 data is inserted as current version
UPDATE about_info
SET is_curr = (version_number = 'Sprint 7')
WHERE team_number = 'Team 3';
    