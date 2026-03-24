require("dotenv").config();
const express = require('express');
const bcrpyt = require('bcrypt')
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors')
const bcrypt = require('bcrypt');
const { generateAccessToken, decodeAccessToken } = require("./generateAccessToken")
//const prompt = require('prompt-sync')({ sigint: true });

const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;
const allowedOrigins = ['http://localhost:5173'];

const db = mysql.createPool({
	host: "cpsc4910-s26.cobd8enwsupz.us-east-1.rds.amazonaws.com",
	user: "CPSC4911_admin",
	password: "AmR3rnvsSJRrJaMJ5Jt2",
	database: "Team03_DB",
	port: 3306,
	connectionLimit: 10,
	queueLimit: 0,
	waitForConnections: true,
	enableKeepAlive: true,
	keepAliveInitialDelay: 10000,
	connectTimeout: 10000,
});

db.query('SELECT 1', (err) => {
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
	try{
	const { email, password, role_type} = req.body;
	console.log(req.body);
	const hashedPassword = await bcrypt.hash(password, 10);
	const query = 'INSERT INTO users (email, password_hash, role_type, is_active) VALUES (?,?,?,?)';
	const values = [email, hashedPassword, role_type, 1];
	db.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database insert failed" });
            }
            res.json({
                message: "Account created successfully",
                user_id: result.insertId
            });
        });
	} catch (error){
		console.error("Server error:", error);
		res.status(500).json({ error: "Internal Server error" });
	}
});

app.get('/api/search', async (req, res) => {
	const searchTerm = req.query.q; 
	const limit = 10;
	//first api call to get the data we want
    const url = new URL('https://api.etsy.com/v3/application/listings/active');
    url.searchParams.append('keywords', searchTerm);
    url.searchParams.append('limit', limit);

    const requestOptions = {
        method: 'GET',
        headers: {
            'x-api-key': 'eygp51dfkb5pm7buhaxjtm93:str7wniisc', 
            'Accept': 'application/json'
        },
    };

    const response = await fetch(url.toString(), requestOptions);
    const data = await response.json();


	
    if (response.ok) {
    const newData = data.results.map(item => ({
        listing_id: item.listing_id,
        title: item.title,
        price: item.price.amount,
        image: '',
        ratingAvg: 0
    }));

    const listingIds = newData.map(item => item.listing_id).join(',');


	const imgRes = await fetch(`https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${listingIds}&includes=Images`, requestOptions);
    const imgData = await imgRes.json();

        
    const detailRes = await fetch(`https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${listingIds}`, requestOptions);
    const detailData = await detailRes.json();

    newData.forEach((item) => {
            
        const listingDetails = detailData.results.find(d => d.listing_id === item.listing_id);
        const listingImages = imgData.results.find(img => img.listing_id === item.listing_id);

        //item.ratingAvg = listingDetails.review_average || 0;
        item.image = listingImages.images[0].url_fullxfull;
    });

    res.status(200).json(newData);
	}
});


//searching for product
app.get('/api/product', async (req, res) => {
	let product_id = parseInt(req.query.q, 10);
	//api spec stuff
	const requestOptions = {
        method: 'GET',
        headers: {
            'x-api-key': 'eygp51dfkb5pm7buhaxjtm93:str7wniisc', 
            'Accept': 'application/json'
        },
    };
	//first api call to listing
	const url = new URL(`https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${product_id}`);
	const response = await fetch(url.toString(), requestOptions);
    const data = await response.json();

	//format the response that we want
	if (response.ok) {
		const newData = data.results.map(item => ({
			listing_id: item.listing_id,
			title: item.title,
			price: item.price.amount,
			description: item.description,
			materials: item.materials,
			image: '',
			ratingAvg: 0
		}));

		//second api call for the image
		const imgRes = await fetch(`https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${product_id}&includes=Images`, requestOptions);
		const imgData = await imgRes.json();

		//add the image link to final response
		newData.forEach((item) => {
            
        
			const listingImages = imgData.results.find(img => img.listing_id === item.listing_id);

			//item.ratingAvg = listingDetails.review_average || 0;
			item.image = listingImages.images[0].url_fullxfull;
		});

		res.status(200).json(newData);
	}
	
});

//showing the details of you cart
app.get('/api/cart', async (req, res) =>{
	const user_id = req.query.user_id;

	//getting the product values from the database
	const query = 'SELECT cart FROM drivers WHERE user_id = ?';
	db.query(query, [user_id], async (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Database Error" });
		}
		if (results.length === 0) {
			return res.status(404).json({ error: "No data found" });
		}
		const prodList = String(results[0].cart);


		//call the data we want from etsy api
		let cleanList = prodList.slice(1);
		

		const requestOptions = {
        method: 'GET',
        headers: {
            'x-api-key': 'eygp51dfkb5pm7buhaxjtm93:str7wniisc', 
            'Accept': 'application/json'
        },
		};
		const listingIds = cleanList.split(',').map(id => id.trim()).join(',');
		const url = `https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${listingIds}&includes=Images`;
        const response = await fetch(url, requestOptions);
        const data = await response.json();

		const newData = data.results.map(item => ({
			listing_id: item.listing_id,
			title: item.title,
			price: item.price.amount,
			image: '',
			ratingAvg: 0
		}));

		//second api call for the image
		const imgRes = await fetch(`https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${listingIds}&includes=Images`, requestOptions);
		const imgData = await imgRes.json();

		//add the image link to final response
		newData.forEach((item) => {
            
        
			const listingImages = imgData.results.find(img => img.listing_id === item.listing_id);

			//item.ratingAvg = listingDetails.review_average || 0;
			item.image = listingImages.images[0].url_fullxfull;
		});

		res.status(200).json(newData);
	});

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

app.post("/login", (req, res)=> {
	const user = req.body.name
	const password = req.body.password

	const sqlSearch = 'SELECT * FROM users WHERE email = ?';
	const search_query = mysql.format(sqlSearch,[user])
	db.query(search_query, async (err, userResults) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: "Database Error"});
		}
		if (userResults.length === 0) {
			console.log("User doesn't exist.")
			return res.status(404).json({error: "Email or password incorrect."});
		} else {
			const hashedPassword = userResults[0].password_hash
			if (await bcrypt.compare(password, hashedPassword)) {
				console.log("Login Successful")
				const userRole = userResults[0].role_type;
				console.log("Generating accessToken")
				const token = generateAccessToken({user: user, role: userRole})
				const decoded = decodeAccessToken(token)
				console.log(token)
				console.log(decoded)
				return res.json({accessToken: token, role: userRole})
			} else {
				console.log("Password Incorrect")
				return res.status(404).json({error: "Email or password incorrect."})
			}
		}
	})
})

app.post("/AccountInfo", (req, res)=> {
	const key = req.body.key
	const email = decodeAccessToken(key)

	const sqlSearch = 'SELECT * FROM users WHERE email = ?';
	const search_query = mysql.format(sqlSearch,[email])
	db.query(search_query, async (err, userResults) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: "Database Error"});
		}
		if (userResults.length === 0) {
			console.log("User doesn't exist.")
			return res.status(404).json({error: "Authentication error"});
		} else {
			const role = userResults[0].role_type
			const isActive = userResults[0].is_active
			const createDate = userResults[0].created_at
			const updatedDate = userResults[0].updated_at
			const username = userResults[0].username
			return res.json({role:role, isActive:isActive, createDate:createDate, updatedDate:updatedDate,
									username:username, email:email})
		}
	})
})

app.post("/SetUsername", (req, res) => {
	const newUsername = req.body.newUsername
	const token = req.body.token
	const email = decodeAccessToken(token)

	const sqlInsert = "update users set username = ? where email = ?"
	const insert_query = mysql.format(sqlInsert,[newUsername, email])
	db.query(insert_query, async (err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: "Database Error"});
		} else {
			return res.ok
		}
	})
})

// Forgot Password Route
app.post('/api/forgot-password', (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ error: "Email is required!" });
	}

	const query = 'SELECT user_id, email FROM users WHERE email = ?';

	db.query(query, [email], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Database Error" });
		}

		const successResponse = {
			success: true,
			message: "If an account exists with this email, you'll receive a password reset email."
		};

		if (results.length === 0) {
			return res.json(successResponse);
		}

		const user = results[0];
		
		// generate secure random token
		const crypto = require('crypto');
		const resetToken = crypto.randomBytes(32).toString('hex');
		
		// ensure token expires in 30 minutes
		//const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

		// save token to database
		db.query(
			'INSERT INTO reset_password_tokens (user_id, token, expires_at, used) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE), FALSE)',
			[user.user_id, resetToken],
			(err) => {
				if (err) {
					console.error('Error storing token!', err);
					return res.status(500).json({ error: "Database Error" });
				}

				// log the reset URL (for testing without email)
				console.log(`Password reset token created for ${email}`);
				console.log(`Reset URL: http://localhost:5173/reset-password?token=${resetToken}`);

				res.json(successResponse);
			}
		);
	});
});

// Reset Password Route
app.post('/api/reset-password', async (req, res) => {
	const { token, password, confirmPassword } = req.body;

	if (!token || !password || !confirmPassword) {
		return res.status(400).json({ error: "All fields are required!" });
	}

	// make sure passwords match
	if (password !== confirmPassword) {
		return res.status(400).json({ error: "Passwords do not match!" });
	}

	// check that token exists and hasn't expired
	db.query(
		'SELECT token_id, user_id FROM reset_password_tokens WHERE token = ? AND expires_at > NOW() AND used = FALSE',
		[token],
		async (err, results) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: "Database Error" });
			}
			
			if (results.length === 0) {
				return res.status(400).json({ error: "Invalid or expired token!" });
			}

			const resetRecord = results[0];

			// hash the new password
			const bcrypt = require('bcrypt');
			const hashedPassword = await bcrypt.hash(password, 10);

			db.query(
				'UPDATE users SET password_hash = ? WHERE user_id = ?',
				[hashedPassword, resetRecord.user_id],
				(err) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ error: "Database Error" });
					}

					// mark token as used
					db.query(
						'UPDATE reset_password_tokens SET used = TRUE WHERE token_id = ?',
						[resetRecord.token_id],
						(err) => {
							if (err) {
								console.error(err);
								return res.status(500).json({ error: "Database Error" });
							}
							
							console.log('Password reset was successful');
							res.json({ success: true, message: "Password reset was successful!" });
						}
					);
				}
			);
		}
	);
});

// create new user route
app.post('/api/admin/users', async (req, res) => {
    const { email, password, role_type } = req.body;
    
    // validate fields
    if (!email || !password || !role_type) {
        return res.status(400).json({ error: 'All fields required' });
    }
    
    if (!['driver', 'sponsor', 'admin'].includes(role_type)) {
        return res.status(400).json({ error: 'Invalid role type' });
    }
    
    if (password.length < 10) {
        return res.status(400).json({ error: 'Password must be at least 10 characters' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = 'INSERT INTO users (email, password_hash, role_type, is_active) VALUES (?, ?, ?, 1)';
        
        db.query(query, [email, hashedPassword, role_type], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.json({ 
                success: true, 
                message: 'User created successfully',
                user_id: result.insertId 
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
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
