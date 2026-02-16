use Team03_DB;

INSERT INTO users
VALUES(304032, 'farin832@gmail.com', 'x43543fyzlekf123', 'admin', 1, NOW(), NOW());

DELETE FROM users WHERE user_id = 304032;

SELECT * FROM users;