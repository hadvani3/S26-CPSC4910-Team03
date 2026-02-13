const http = require('http');
const mysql = require("mysql2");
const express require('express');
const app = express();



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
});


const server = http.createServer((req, res) => {
    db.query('SELECT team_number, version_number, release_date, product_name, product_desc FROM about_info WHERE id = 1',(err, results) => {
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
	const team_number = row.team_number;
	const version_number = row.version_number;
	const release_date = row.release_date;
	const product_name = row.product_name;
	const product_desc = row.product_desc;
	//console.log(team_number, version_number, release_date, product_name, product_desc);
	
	res.statusCode = 200;
	res.setHeader('Content-type', 'text/html');
	res.end(`
		<!DOCTYPE html>
		<html lang="en">
		<head>
		    <meta charset="UTF-8">
		    <title>About Us</title>
		    <style>
		        body {
				            font-family: Arial, Helvetica, sans-serif;
				            background-color: #f4f6f8;
				            margin: 0;
				            padding: 40px;
				        }

		        .container {
				            max-width: 700px;
				            margin: auto;
				            background: #ffffff;
				            padding: 30px;
				            border-radius: 10px;
				            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
				        }

		        h1 {
				            margin-top: 0;
				            color: #2c3e50;
				        }

		        .label {
				            font-weight: bold;
				            color: #34495e;
				        }

		        .item {
				            margin-bottom: 15px;
				            font-size: 16px;
				        }
		    </style>
		</head>
		<body>
		    <div class="container">
		        <h1>About Us</h1>

		        <div class="item">
		            <span class="label">Product:</span> ${product_name}
		        </div>

		        <div class="item">
		            <span class="label">Version:</span> ${version_number}
		        </div>

		        <div class="item">
		            <span class="label">Team:</span> ${team_number}
		        </div>

		        <div class="item">
		            <span class="label">Release Date:</span> ${release_date.toDateString()}
		        </div>

		        <div class="item">
		            <span class="label">Product Description:</span><br>
		            ${product_desc}
		        </div>
		    </div>
		</body>
		</html>
		`);

	/*res.end('About us\n\nProduct: ' + product_name + '\nVersion:' + version_number + '\nTeam: ' + team_number + '\nRelease Date: ' + release_date + '\nProduct Description: ' + product_desc);*/
    });
 });

server.listen(3000, '0.0.0.0', () => {
    console.log('Server running at http://100.51.75.41:3000');
});
























