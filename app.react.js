
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
	host: "cpsc4910-s26.cobd8enwsupz.us-east-1.rds.amazonaws.com",
	user: "CPSC4911_admin",
	password: "AmR3rnvsSJRrJaMJ5Jt2",
	database: "Team03_DB",
	port: 3306
});

db.connect(err => {
	if (err) {
		console.error("MySQL connection failed:", err);
		process.exit(1);
	}
	console.log("Connected to MySQL RDS");
});

app.use(express.json());

//API routes

app.get('/api/about', (req, res) => {
	const query = 'SELECT team_number, version_number, release_date, product_name, product_desc FROM about_info WHERE is_curr = 1';
	const query2 = 'SELECT product_desc FROM about_info WHERE id = 2';

	db.query(query, (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Database Error" });
		}
		if (results.length === 0) {
			return res.status(404).json({ error: "No data found" });
		}
		const row = results[0];

		db.query(query2, (err, results2) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: "Database Error" });
			}
			if (results2.length === 0) {
				return res.status(404).json({ error: "No data found" });
			}
			const row2 = results2[0];

			res.json({
				team_number: row.team_number,
				version_number: row.version_number,
				release_date: row.release_date ? row.release_date.toDateString() : null,
				product_name: row.product_name,
				product_desc: row.product_desc,
				sponsor_desc: row2.product_desc
			});
		});
	});
});

//Serve React build
const clientDist = path.join(__dirname, 'client', 'dist');
const fs = require('fs');
if (fs.existsSync(clientDist)) {
	app.use(express.static(clientDist));
	// SPA fallback, send index.html for any request not handled by API or static files
	app.use((req, res) => {
		res.sendFile(path.join(clientDist, 'index.html'));
	});
} else {
	
	app.use((req, res) => {
		res.status(404).send(
			'React build not found. Run "npm run build:client" then restart, or for local dev run "cd client && npm run dev" and use the Vite URL (e.g. http://localhost:5173).'
		);
	});
}

app.listen(PORT, '0.0.0.0', () => {
	console.log(`React server running on port ${PORT}`);
});
