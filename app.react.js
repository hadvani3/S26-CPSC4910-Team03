
const express = require('express');
const bcrpyt = require('bcrypt')
const mysql = require('mysql2');
const path = require('path');
const generateAccessToken = require("./generateAccessToken")

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
app.use(express.urlencoded({extended: true}));

//API routes

app.post('/create_account', async (req, res) => {
	const { email, password, role} = req.body;
	console.log(req.body);
	const hashedPassword = await bcrpyt.hash(password, 10);
	const query = 'INSERT INTO users (email, password_hash, role_type, is_active) VALUES (?,?,?,?)';
	const values = [email, hashedPassword, role, 0];
	db.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database insert failed" });
            }
            res.json({
                message: "Account created successfully",
                user_id: result.insertId
            });
        })
});


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

app.post("/", (req, res)=> {
	const user = req.body.name
	const password = req.body.password
	const sqlSearch = 'SELECT * FROM users WHERE email = ?';
	const search_query = mysql.format(sqlSearch,[user])
	db.query(search_query, (err, userResults) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: "Database Error"});
		}
		if (userResults.length === 0) {
			console.log("User doesn't exist.")
			return res.status(404).json({error: "No data found"});
		}
		else {
			const hashedPassword = userResults[0].hash_password
			//get the hashedPassword from result
			if (password === hashedPassword) {
				console.log("---------> Login Successful")
				console.log("---------> Generating accessToken")
				const token = generateAccessToken({user: user})
				console.log(token)
				res.json({accessToken: token})
			}
			else {
				console.log("---------> Password Incorrect")
				res.send("Password incorrect!")
			} //end of bcrypt.compare()
		}
	})
})

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
