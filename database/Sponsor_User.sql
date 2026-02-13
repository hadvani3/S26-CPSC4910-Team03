USE Team03_DB;

insert into about_info (team_number, version_number, release_date, 
product_name, product_desc, is_curr) 
value ('Team 3', 'Sprint 2', curdate(), 'Sponsor Users', 
'Sponsors have the power to create accounts representing their staff,
accept and reject driver applications to the program, manage driver
accounts, award and dock points, and maintain a catalog of products
for drivers to purchase supplied by a public API.', TRUE);
