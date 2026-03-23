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
    'Sprint 6',
    CURDATE(),
    'Good Driver Incentive Program',
    'Sprint 6 Changes - Our web application now includes fully functional login for all user types. The product catalog list is functional as well.',
    TRUE

WHERE NOT EXISTS (
	SELECT 1
    FROM about_info
    WHERE team_number = 'Team 3' AND version_number = 'Sprint 6'
);

-- ensure that only Sprint 6 data is inserted as current version
UPDATE about_info
SET is_curr = (version_number = 'Sprint 6')
WHERE team_number = 'Team 3';
    