const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
	host: "cpsc4910-s26.cobd8enwsupz.us-east-1.rds.amazonaws.com",
	user: "CPSC4911_admin",
	password: "AmR3rnvsSJRrJaMJ5Jt2",
	database: "Team03_DB",
	port: 3306
});

db.connect(err => {
	if(err){
		console.error("MySQL connection failed:", err);
		process.exit(1);
	}
	console.log("Connected to MySQL RDS");
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend'));

app.use(express.static(path.join(__dirname,'frontend')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend', 'loginpage.html'));
});

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server running on port ${PORT}`);
});

app.get('/about', (req, res) => {

	const query = 'SELECT team_number, version_number, release_date, product_name, product_desc FROM about_info WHERE id = 1';
	const query2 = 'SELECT product_desc FROM about_info WHERE id = 2';
	db.query(query, (err, results) =>{
		if(err){
			console.error(err);
			return res.status(500).send("Database Error");
		}
		if(results.length === 0){
			return res.status(404).send("No data found");
		}

		const row = results[0];

		db.query(query2, (err, results2) =>{
                	if(err){
                        	console.error(err);
                        	return res.status(500).send("Database Error");
                	}
                	if(results.length === 0){
                        	return res.status(404).send("No data found");
                	}

			const row2 = results2[0]

			res.render('about', {
				team_number: row.team_number,
				version_number: row.version_number,
				release_date: row.release_date.toDateString(),
				product_name: row.product_name,
				product_desc: row.product_desc,
				sponsor_desc: results2.product_desc
			});
		});
	});
});


app.get('/create_account', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend', 'CreateAccount.html'));
});


	



