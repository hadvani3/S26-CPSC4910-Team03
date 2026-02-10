const http = require('http');

const mysql = require("mysql2");

const prompt = require('prompt-sync')();

const db = mysql.createConnection({
        host: "cpsc4910-s26.cobd8enwsupz.us-east-1.rds.amazonaws.com",
        user: "CPSC4911_admin",
        password: "AmR3rnvsSJRrJaMJ5Jt2",
        database: "Team03_DB",
        port: 3306
});

db.connect(err => {
        if(err){
                console.error("Connection Failed:", err);
                return;
        }
        console.log("Connected to MySQL RDS");
	db.query('SELECT email, password_hash FROM users WHERE user_id = 1',(err, results) => {
        if(err){
            console.error(err);
            res.statusCode = 500;
            return;
        }
        if(results.length === 0){
            console.log("No row found");
            res.statusCode = 404;
            return;
        }
        const row = results[0];
        const email  = row.email;
        const password = row.password_hash;
        console.log(email, password);
        const get_email = prompt("Email: ")
        const get_password = prompt("Password: ")
        if (email == get_email && password == get_password) {
                console.log("Success\n")
        }
        else {
                console.log("Incorrect\n")
        }

    });
});

const server = http.createServer((req, res) => {
    db.query('SELECT email, password_hash FROM users WHERE id = 1',(err, results) => {
        if(err){
            console.error(err);
            res.statusCode = 500;
            return;
        }
        if(results.length === 0){
            console.log("No row found");
            res.statusCode = 404;
            return;
        }
        const row = results[0];
        const email  = row.email;
        const password_hash = row.password_hash;
        console.log(email, password);
	const get_email = prompt("Email: ")
	const get_password = prompt("Password: ")
	if (email == get_email && password == get_password) {
		console.log("Success\n")
	}
	else {
	        console.log("Incorrect\n")
	}

    });
});
