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
    'Sprint 3',
    CURDATE(),
    'Good Driver Incentive Program',
    'A full-stack web application designed to reward drivers for good driving habits.',
    TRUE

WHERE NOT EXISTS (
	SELECT 1
    FROM about_info
    WHERE team_number = 'Team 3' AND version_number = 'Sprint 3'
);

-- ensure that only sprint 3 row is inserted
UPDATE about_info
SET is_curr = (version_number = 'Sprint 3')
WHERE team_number = 'Team 3';
    