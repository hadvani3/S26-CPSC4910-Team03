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
    'Sprint 8',
    CURDATE(),
    'Good Driver Incentive Program',
    'Sprint 8 Changes - Implemented driver application submission and admin/sponsor flow with approve and reject functionality. Added admin bulk-upload page with pipe-delimited file support. Fixed user creation bugs.',
    TRUE

WHERE NOT EXISTS (
	SELECT 1
    FROM about_info
    WHERE team_number = 'Team 3' AND version_number = 'Sprint 8'
);

-- ensure that only Sprint 8 data is inserted as current version
UPDATE about_info
SET is_curr = (version_number = 'Sprint 8')
WHERE team_number = 'Team 3';
    