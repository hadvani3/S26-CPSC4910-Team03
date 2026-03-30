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

function getBearerToken(req) {
	const auth = req.headers.authorization;
	if (!auth || typeof auth !== 'string') return null;
	const parts = auth.trim().split(/\s+/);
	if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null;
	return parts[1];
}

//API routes

app.post('/create_account', async (req, res) => {
	try{
	const { email, password, role_type, first_name, last_name } = req.body;
	if (role_type !== 'driver') {
		return res.status(400).json({ error: "Only driver accounts can be created through the homepage." });
	}
	console.log(req.body);
	const hashedPassword = await bcrypt.hash(password, 10);
	const query = 'INSERT INTO users (email, password_hash, role_type, is_active) VALUES (?,?,?,?)';
	const values = [email, hashedPassword, role_type, 1];
	db.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database insert failed" });
            }

			const newUserId = result.insertId;

			if (role_type === 'driver') {
				db.query(
					'INSERT INTO drivers (user_id, first_name, last_name) VALUES (?, ?, ?)',
					[newUserId, first_name || '', last_name || ''],
					(err2) => {
						if (err2) {
                        console.error(err2);
                        return res.status(500).json({ error: "Driver profile creation failed" });
                    }
                    res.json({
                        message: "Account created successfully",
                        user_id: newUserId
                    });
                }
            );
		}else {
			res.json({
				message: "Account created successfully",
				user_id: newUserId
			});
		}
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
	const token = req.body.key
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

app.post("/GetSponsorDrivers", (req, res) => {
	const sponsorID = req.body.sponsorID
	console.log(sponsorID)

	const sqlSearch = "select * from drivers where sponsor_id = ?"
	const search_query = mysql.format(sqlSearch, [sponsorID])
	db.query(search_query, async (err, driverResults) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: "Database Error"});
		}
		if (driverResults.length === 0) {
			console.log("No drivers")
			return res.status(404).json({error: "There are no drivers for this sponsor"});
		} else {
			return res.json(driverResults.map(d => ({
				driver_id: d.driver_id,
				firstname: d.first_name,
				lastname: d.last_name,
				phone: d.phone_number,
				points: d.total_points,
				createDate: d.created_at,
				updatedDate: d.updated_at
			})));
		}
	})
})

app.post("/GetSponsor", (req, res) => {
	const token = req.body.key
	console.log(token)
	const email = decodeAccessToken(token)
	console.log(email)

	const sqlSearch = "select * from users where email = ?"
	const search_query = mysql.format(sqlSearch, [email])
	db.query(search_query, async (err, userResults) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: "Database Error"});
		}
		if (userResults.length === 0) {
			console.log("No user with that email")
			return res.status(404).json({error: "No user with that email"});
		} else {
			const user_id = userResults[0].user_id
			const sqlSearch2 = "select * from sponsor_users where user_id = ?"
			const search_query2 = mysql.format(sqlSearch2, [user_id])
			db.query(search_query2, async (err, sponsorResults) => {
				if (err) {
					console.error(err);
					return res.status(500).json({error: "Database Error"});
				}
				if (sponsorResults.length === 0) {
					console.log("No sponsor user with that id")
					return res.status(404).json({error: "No sponsor user with that id"});
				} else {
					const sponsor_id = sponsorResults[0].sponsor_id
					return res.json({sponsor_id:sponsor_id})
				}
			})
		}
	})
})

app.post('/ChangePoints', (req, res) => {
	const driverID = req.body.driver_id
	const change = req.body.change
	const sponsor_id = req.body.sponsor_id

	const update = "UPDATE drivers SET total_points = total_points + ? WHERE driver_id = ?"
	const update_query = mysql.format(update, [change, driverID])
	db.query(update_query, async (err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: "Database Error"});
		} else {
			insert = "INSERT INTO driver_points (driver_id, sponsor_id, points_change) VALUES (?, ?, ?);"
			insert_query = mysql.format(insert, [driverID, sponsor_id, change])
			db.query(insert_query, async (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({error: "Database Error"});
				} else {
					return res.json({ success: true });
				}
			})
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
    const { email, password, role_type, first_name, last_name, sponsor_id } = req.body;
    
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

            const newUserId = result.insertId;

            if (role_type === 'sponsor') {
                const sponsorQuery = 'INSERT INTO sponsor_users (user_id, sponsor_id, first_name, last_name) VALUES (?, ?, ?, ?)';
                db.query(sponsorQuery, [newUserId, sponsor_id, first_name, last_name], (err2) => {
                    if (err2) {
                        console.error(err2);
                        return res.status(500).json({ error: 'User created but sponsor profile failed' });
                    }
                    return res.json({
                        success: true,
                        message: 'Sponsor user created successfully',
                        user_id: newUserId
                    });
                });
            } else if (role_type === 'driver') {
                const driverQuery = 'INSERT INTO drivers (user_id, first_name, last_name) VALUES (?, ?, ?)';
                db.query(driverQuery, [newUserId, first_name, last_name], (err2) => {
                    if (err2) {
                        console.error(err2);
                        return res.status(500).json({ error: 'User created but driver profile failed' });
                    }
                    return res.json({
                        success: true,
                        message: 'Driver user created successfully',
                        user_id: newUserId
                    });
                });
            } else {
                return res.json({
                    success: true,
                    message: 'User created successfully',
                    user_id: newUserId
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
        /*db.query(query, [email, hashedPassword, role_type], (err, result) => {
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
    }*/
});

// get all users
app.get('/api/admin/users', (req, res) => {
    const { role, status, search } = req.query;
    
    let query = 'SELECT user_id, email, role_type, is_active, created_at FROM users WHERE 1=1';
    const params = [];
    
    // filter by role
    if (role && role !== 'all') {
        query += ' AND role_type = ?';
        params.push(role);
    }
    
    // filter by status
    if (status && status !== 'all') {
        query += ' AND is_active = ?';
        params.push(status === 'active' ? 1 : 0);
    }
    
    // search by email
    if (search) {
        query += ' AND email LIKE ?';
        params.push(`%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    db.query(query, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ 
            success: true,
            users: results 
        });
    });
});

// toggle user active status
app.post('/api/admin/users/:id/toggle-status', (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;
    
    if (is_active === undefined) {
        return res.status(400).json({ error: 'is_active field required' });
    }
    
    db.query(
        'UPDATE users SET is_active = ? WHERE user_id = ?',
        [is_active, id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            res.json({ 
                success: true, 
                message: `User ${is_active ? 'activated' : 'deactivated'} successfully` 
            });
        }
    );
});

// Delete user
app.delete('/api/admin/users/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM users WHERE user_id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ 
            success: true, 
            message: 'User deleted successfully' 
        });
    });
});

// admin dashboard route
app.get('/api/admin/stats', (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM users) as totalUsers,
            (SELECT COUNT(*) FROM users WHERE role_type = 'driver') as totalDrivers,
            (SELECT COUNT(*) FROM users WHERE role_type = 'sponsor') as totalSponsors,
            (SELECT COUNT(*) FROM driver_applications WHERE application_status = 'PENDING') as pendingApplications
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
            totalUsers: results[0].totalUsers || 0,
            totalDrivers: results[0].totalDrivers || 0,
            totalSponsors: results[0].totalSponsors || 0,
            pendingApplications: results[0].pendingApplications || 0
        });
    });
});

// get sponsors
app.get('/api/sponsors', (req, res) => {
    db.query(
        'SELECT sponsor_id, company_name FROM sponsors WHERE is_active = 1',
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        }
    );
});

// driver submits sponsor application (user_id + sponsor_id resolved in SQL)
app.post('/api/driver-applications', (req, res) => {
    const {
        first_name,
        last_name,
        birth_date,
        email_address,
        phone_number,
        street_address,
        city,
        zip_code,
        reason,
        company_name,
    } = req.body;

    const emailTrim = typeof email_address === 'string' ? email_address.trim() : '';
    const companyTrim = typeof company_name === 'string' ? company_name.trim() : '';

    if (
        !first_name ||
        !last_name ||
        !birth_date ||
        !emailTrim ||
        !phone_number ||
        !street_address ||
        !city ||
        !zip_code ||
        !reason ||
        !companyTrim
    ) {
        return res.status(400).json({ error: 'All application fields are required' });
    }

    const fn = String(first_name).trim();
    const ln = String(last_name).trim();
    const phone = String(phone_number).trim();
    const street = String(street_address).trim();
    const cityVal = String(city).trim();
    const zip = String(zip_code).trim();
    const reasonVal = String(reason).trim();

    if (fn.length > 50 || ln.length > 50) {
        return res.status(400).json({ error: 'Name fields exceed maximum length' });
    }
    if (emailTrim.length > 100) {
        return res.status(400).json({ error: 'Email exceeds maximum length' });
    }
    if (phone.length > 25) {
        return res.status(400).json({ error: 'Phone number exceeds maximum length' });
    }
    if (street.length > 255 || cityVal.length > 100 || zip.length > 20) {
        return res.status(400).json({ error: 'Address fields exceed maximum length' });
    }

    db.query(
        'SELECT user_id FROM users WHERE email = ? AND role_type = ? LIMIT 1',
        [emailTrim, 'driver'],
        (err, userRows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (!userRows || userRows.length === 0) {
                return res.status(404).json({
                    error: 'No active driver account found for that email address',
                });
            }

            const user_id = userRows[0].user_id;

            db.query(
                'SELECT sponsor_id FROM sponsors WHERE company_name = ? AND is_active = 1 LIMIT 1',
                [companyTrim],
                (err2, sponsorRows) => {
                    if (err2) {
                        console.error(err2);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    if (!sponsorRows || sponsorRows.length === 0) {
                        return res.status(404).json({ error: 'Sponsor not found or inactive' });
                    }

                    const sponsor_id = sponsorRows[0].sponsor_id;

                    const insertSql = `
                        INSERT INTO driver_applications (
                            user_id,
                            sponsor_id,
                            first_name,
                            last_name,
                            birth_date,
                            email_address,
                            phone_number,
                            license_number,
                            street_address,
                            city,
                            state,
                            zip_code,
                            reason,
                            application_status,
                            notes,
                            reviewed_at,
                            created_at,
                            updated_at
                        ) VALUES (
                            ?, ?, ?, ?, ?, ?, ?,
                            NULL,
                            ?, ?, NULL, ?,
                            ?,
                            'PENDING',
                            NULL,
                            NULL,
                            NOW(),
                            NOW()
                        )
                    `;

                    db.query(
                        insertSql,
                        [
                            user_id,
                            sponsor_id,
                            fn,
                            ln,
                            birth_date,
                            emailTrim,
                            phone,
                            street,
                            cityVal,
                            zip,
                            reasonVal,
                        ],
                        (err3, result) => {
                            if (err3) {
                                console.error(err3);
                                return res.status(500).json({ error: 'Failed to save application' });
                            }
                            res.status(201).json({
                                success: true,
                                application_id: result.insertId,
                            });
                        }
                    );
                }
            );
        }
    );
});

// List driver applications for review (admin: all sponsors; sponsor: own org only)
app.get('/api/applications/review', (req, res) => {
	const token = getBearerToken(req);
	if (!token) {
		return res.status(401).json({ error: 'Authorization required' });
	}
	const email = decodeAccessToken(token);
	if (!email) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}

	db.query(
		'SELECT user_id, role_type FROM users WHERE email = ? AND is_active = 1 LIMIT 1',
		[email],
		(err, urows) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: 'Database error' });
			}
			if (!urows.length) {
				return res.status(401).json({ error: 'User not found' });
			}

			const { user_id, role_type } = urows[0];

			const selectBase = `
				SELECT
					da.application_id,
					da.user_id,
					da.sponsor_id,
					da.first_name,
					da.last_name,
					da.birth_date,
					da.email_address,
					da.phone_number,
					da.license_number,
					da.street_address,
					da.city,
					da.state,
					da.zip_code,
					da.reason,
					da.application_status,
					da.notes,
					da.reviewed_at,
					da.created_at,
					s.company_name AS sponsor_name
				FROM driver_applications da
				JOIN sponsors s ON s.sponsor_id = da.sponsor_id
			`;

			if (role_type === 'admin') {
				db.query(
					`${selectBase} ORDER BY da.created_at DESC`,
					(e2, results) => {
						if (e2) {
							console.error(e2);
							return res.status(500).json({ error: 'Database error' });
						}
						res.json(results);
					}
				);
				return;
			}

			if (role_type === 'sponsor') {
				db.query(
					'SELECT sponsor_id FROM sponsor_users WHERE user_id = ? LIMIT 1',
					[user_id],
					(e3, srows) => {
						if (e3) {
							console.error(e3);
							return res.status(500).json({ error: 'Database error' });
						}
						if (!srows.length) {
							return res.status(403).json({
								error: 'No sponsor organization linked to this account',
							});
						}
						const sponsorId = srows[0].sponsor_id;
						db.query(
							`${selectBase} WHERE da.sponsor_id = ? ORDER BY da.created_at DESC`,
							[sponsorId],
							(e4, results) => {
								if (e4) {
									console.error(e4);
									return res.status(500).json({ error: 'Database error' });
								}
								res.json(results);
							}
						);
					}
				);
				return;
			}

			return res.status(403).json({ error: 'Access denied' });
		}
	);
});

// Approve or reject an application (admin or owning sponsor only)
app.patch('/api/applications/:id/review', (req, res) => {
	const applicationId = parseInt(req.params.id, 10);
	if (Number.isNaN(applicationId)) {
		return res.status(400).json({ error: 'Invalid application id' });
	}

	const { application_status, notes } = req.body;
	if (!['APPROVED', 'REJECTED'].includes(application_status)) {
		return res.status(400).json({ error: 'application_status must be APPROVED or REJECTED' });
	}

	const token = getBearerToken(req);
	if (!token) {
		return res.status(401).json({ error: 'Authorization required' });
	}
	const email = decodeAccessToken(token);
	if (!email) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}

	db.query(
		'SELECT user_id, role_type FROM users WHERE email = ? AND is_active = 1 LIMIT 1',
		[email],
		(err, urows) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: 'Database error' });
			}
			if (!urows.length) {
				return res.status(401).json({ error: 'User not found' });
			}

			const reviewer = urows[0];
			if (reviewer.role_type !== 'admin' && reviewer.role_type !== 'sponsor') {
				return res.status(403).json({ error: 'Access denied' });
			}

			db.query(
				'SELECT * FROM driver_applications WHERE application_id = ? LIMIT 1',
				[applicationId],
				(e2, apps) => {
					if (e2) {
						console.error(e2);
						return res.status(500).json({ error: 'Database error' });
					}
					if (!apps.length) {
						return res.status(404).json({ error: 'Application not found' });
					}

					const row = apps[0];
					if (row.application_status !== 'PENDING') {
						return res.status(400).json({ error: 'Application is no longer pending' });
					}

					const notesVal =
						notes != null && String(notes).trim() !== ''
							? String(notes).trim().slice(0, 500)
							: null;

					const runUpdate = () => {
						db.query(
							`UPDATE driver_applications
							 SET application_status = ?, notes = ?, reviewed_at = NOW(), updated_at = NOW()
							 WHERE application_id = ?`,
							[application_status, notesVal, applicationId],
							(e3, result) => {
								if (e3) {
									console.error(e3);
									return res.status(500).json({ error: 'Update failed' });
								}
								if (result.affectedRows === 0) {
									return res.status(404).json({ error: 'Application not found' });
								}
								res.json({ success: true });
							}
						);
					};

					if (reviewer.role_type === 'admin') {
						return runUpdate();
					}

					db.query(
						'SELECT sponsor_id FROM sponsor_users WHERE user_id = ? LIMIT 1',
						[reviewer.user_id],
						(e4, srows) => {
							if (e4) {
								console.error(e4);
								return res.status(500).json({ error: 'Database error' });
							}
							if (!srows.length || srows[0].sponsor_id !== row.sponsor_id) {
								return res.status(403).json({
									error: 'You can only review applications for your organization',
								});
							}
							runUpdate();
						}
					);
				}
			);
		}
	);
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
