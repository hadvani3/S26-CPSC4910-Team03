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
    'Sprint 10',
    CURDATE(),
    'Good Driver Incentive Program',
    'Sprint 10 Changes - Added admin and sponsor user impersonation, password reset via email, password change logging, sponsor audit log, sales by driver report, driver approval now links sponsor, and sponsor dashboard real-time stats.',
    TRUE

WHERE NOT EXISTS (
	SELECT 1
    FROM about_info
    WHERE team_number = 'Team 3' AND version_number = 'Sprint 10'
);

-- ensure that only Sprint 10 data is inserted as current version
UPDATE about_info
SET is_curr = (version_number = 'Sprint 10')
WHERE team_number = 'Team 3';
    