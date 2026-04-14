require("dotenv").config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors')
const bcrypt = require('bcrypt');
const { generateAccessToken, decodeAccessToken } = require("./generateAccessToken")
//const prompt = require('prompt-sync')({ sigint: true });
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;
const allowedOrigins = ['http://localhost:5173'];
const etsyKey = process.env.ETSY_API_KEY;

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
	const limit = 60;
	//first api call to get the data we want
    const url = new URL('https://api.etsy.com/v3/application/listings/active');
    url.searchParams.append('keywords', searchTerm);
    url.searchParams.append('limit', limit);

    const requestOptions = {
        method: 'GET',
        headers: {
            'x-api-key': etsyKey, 
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
            'x-api-key': etsyKey, 
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

//show the catalogue for a given sponsor
app.get('/api/:sponsor_id/catalog', async (req, res) =>{
	const { sponsor_id } = req.params;
	//get the list of ids from the sponsor catalog
	const query = 'SELECT catalog FROM sponsors WHERE sponsor_id = ?';
	db.query(query, [sponsor_id], async (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Database Error" });
		}
		if (results.length === 0) {
			return res.status(404).json({ error: "No data found" });
		}
		const prodList = String(results[0].catalog);

		let cleanList = prodList.slice(1);

		const requestOptions = {
        method: 'GET',
        headers: {
            'x-api-key': etsyKey, 
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
	} );
});


async function fetchGroupProducts(listingIdsArray) {
    if (!listingIdsArray || listingIdsArray.length === 0) return [];

	//get the unique ids we send to the api
    let uniqueIds = [];
	for (var i = 0; i < listingIdsArray.length; i++) {
		var currentId = listingIdsArray[i];
		
		if (uniqueIds.indexOf(currentId) === -1) {
			uniqueIds.push(currentId);
		}
	}

	const requestOptions = {
        method: 'GET',
        headers: {
            'x-api-key': etsyKey, 
            'Accept': 'application/json'
        },
	};

        const productPromises = uniqueIds.map(async (id) => {
            //send out the request for an item
            const url = `https://openapi.etsy.com/v3/application/listings/${id}?includes=images`;
            
            const response = await fetch(url, requestOptions);
            const data = await response.json();

            return {
                listing_id: data.listing_id,
                title: data.title,
                price: data.price.amount,
                image: data.images && data.images.length > 0 ? data.images[0].url_fullxfull : '',
                ratingAvg: 0
            };
        });

        const results = await Promise.all(productPromises);
        
        return results;
}

//get the purchase history of a user
app.post('/api/purchase-history', async (req, res) => {
    try {
        const token = req.body.key;

        
        const email = decodeAccessToken(token);


        const getUser = () => new Promise((resolve, reject) => {
            db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, results) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(results);
				}
			});
		});

        const getPurchases = (uid) => new Promise((resolve, reject) => {
            db.query('SELECT * FROM purchases WHERE user_id = ?', [uid], (err, results) => {
				if(err) {
					return reject(err)
				}else {
					return resolve(results);
				}
			});
		});

        const userResults = await getUser();
        if (!userResults || userResults.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user_id = userResults[0].user_id;

    
        const purchaseResults = await getPurchases(user_id);
        if (purchaseResults.length === 0) return res.status(200).json([]);

		//fix the format of the etsy cart strings
        const allListingIds = purchaseResults.flatMap(p => {
            if (p.cart && typeof p.cart === 'string') {
                return p.cart.split(',');
            }
            return [];
        })
        .map(id => id.trim())
        .filter(id => id !== ""); 

        //fetch the data from etsy api
        let etsyProducts = [];
        if (allListingIds.length > 0) {
            etsyProducts = await fetchGroupProducts(allListingIds);
			console.log("Total IDs sent to Etsy:", allListingIds.length);
			console.log("IDs actually returned by Etsy:", etsyProducts.map(e => e.listing_id));
        }
        
        //format the data that we send back
        const detailedHistory = purchaseResults.map(purchase => {
            const idsInThisCart = purchase.cart 
                ? purchase.cart.split(',').map(id => id.trim()).filter(id => id !== "") 
                : [];

            const productsInfo = idsInThisCart.map(id => {
                return etsyProducts.find(e => e.listing_id == id) || { 
                    listing_id: id, 
                    title: "Item no longer available", 
                    price: 0, 
                    image: "" 
                };
            });
            
            return {
                purchase_id: purchase.purchase_id,
    			user_id: purchase.user_id,
    			cost: purchase.cost,
    			cart: purchase.cart,
    			purchased_at: purchase.purchased_at,
                productDetails: productsInfo 
            };
        });

        return res.status(200).json(detailedHistory);

    } catch (error) {
        console.error("Detailed Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

//showing the details of you cart
app.post('/api/cart', async (req, res) =>{
	const token = req.body.key
	const email = decodeAccessToken(token)

	//get the user_id from email
	db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, userResults) => {
		if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database Error" });
        }
        if (userResults.length === 0) {
            return res.status(404).json({ error: "user_id not found not found" });
        }

		const user_id = userResults[0].user_id;
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
			const cartString = String(results[0].cart);


			//call the data we want from etsy api
			const listingIds = cartString.split(',').filter(id => id.trim() !== "");

			const requestOptions = {
			method: 'GET',
			headers: {
				'x-api-key': etsyKey, 
				'Accept': 'application/json'
			},
			};

			// Fetch from Etsy (Etsy returns a UNIQUE list of matching results)
                const url = `https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${listingIds.join(',')}&includes=Images`;
                const response = await fetch(url, requestOptions);
                const data = await response.json();

                if (!data.results) {
                    return res.status(404).json({ error: "No products found on Etsy" });
                }


                const uniqueProducts = data.results.map(item => ({
                    listing_id: item.listing_id,
                    title: item.title,
                    price: item.price.amount,
                    image: item.images && item.images.length > 0 ? item.images[0].url_fullxfull : '',
                    ratingAvg: 0
                }));

                const finalCart = listingIds.map(id => {
                    return uniqueProducts.find(p => p.listing_id == id);
                }).filter(p => p !== undefined); 

                return res.status(200).json(finalCart);
		});
	});
});

app.post('/api/addToCart', async (req, res) => {
	const product = req.body.product_id;
	const count = req.body.count;
	const token = req.body.key
	const email = decodeAccessToken(token)

	if (!email) return res.status(401).json({ error: "Invalid Token" });

	//get the user_id from email
	db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, userResults) => {
		if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Failed to update catalog" });
        }
        if (userResults.affectedRows === 0) {
            return res.status(404).json({ error: "cart not found not found" });
        }

		const user_id = userResults[0].user_id;

		//here i am formatting the addition to the cart
		let addString = ''
		for(let i = 0; i < count; i++){
			addString += `,${product}`;
		}

		//query to add to the cart field
		const query = 'UPDATE drivers SET cart = CONCAT (cart, ?) WHERE user_id = ?';
		db.query(query, [addString, user_id], (err, results) => {
			if (err) {
				console.error("Database Error:", err);
				return res.status(500).json({ error: "Failed to update catalog" });
			}


			if (results.affectedRows === 0) {
				return res.status(404).json({ error: "cart not found not found" });
			}

		
			return res.status(200).json({ success: true, message: "Cart updated" });
		});
	});
})

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
			db.query('INSERT INTO login_attempts (username, success) VALUES (?, 0)', [user]);
			return res.status(404).json({error: "Email or password incorrect."});
		} else {
			const hashedPassword = userResults[0].password_hash
			if (await bcrypt.compare(password, hashedPassword)) {
				console.log("Login Successful")
				db.query('INSERT INTO login_attempts (username, success) VALUES (?, 1)', [user]);
				const userRole = userResults[0].role_type;
				console.log("Generating accessToken")
				const token = generateAccessToken({user: user, role: userRole})
				const decoded = decodeAccessToken(token)
				console.log(token)
				console.log(decoded)
				return res.json({accessToken: token, role: userRole})
			} else {
				console.log("Password Incorrect")
				db.query('INSERT INTO login_attempts (username, success) VALUES (?, 0)', [user]);
				return res.status(404).json({error: "Email or password incorrect."})
			}
		}
	})
})

app.post("/AccountInfo", (req, res)=> {
	const key = req.body.key
	const role = req.body.role
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
			return res.status(404).json({error: "User not found"});
		} else {
			if (role === "admin") {
				const role = userResults[0].role_type
				const isActive = userResults[0].is_active
				const createDate = userResults[0].created_at
				const updatedDate = userResults[0].updated_at
				const username = userResults[0].username
				const user_id = userResults[0].user_id
				return res.json({
					role: role, isActive: isActive, createDate: createDate, updatedDate: updatedDate,
					username: username, email: email, user_id:user_id, first_name:null, last_name:null, phone:null
				})
			}
			if (role === "sponsor") {
				const role = userResults[0].role_type
				const isActive = userResults[0].is_active
				const createDate = userResults[0].created_at
				const updatedDate = userResults[0].updated_at
				const username = userResults[0].username
				const user_id = userResults[0].user_id
				const sponsorSearch = 'SELECT * FROM sponsor_users WHERE user_id = ?';
				const sponsor_query = mysql.format(sponsorSearch,[user_id])
				db.query(sponsor_query, async (err,sponsorResults) => {
					if (err) {
						console.error(err);
						return res.status(500).json({error: "Database Error"});
					}
					if (userResults.length === 0) {
						console.log("User doesn't exist.")
						return res.status(404).json({error: "User not found"});
					} else {
						const first_name = sponsorResults[0].first_name
						const last_name = sponsorResults[0].last_name
						const phone = sponsorResults[0].phone_number
						return res.json({
							role: role, isActive: isActive, createDate: createDate, updatedDate: updatedDate,
							username: username, email: email, user_id:user_id, first_name:first_name, last_name:last_name, phone:phone
						})
					}
				});
			}
			if (role === "driver") {
				const role = userResults[0].role_type
				const isActive = userResults[0].is_active
				const createDate = userResults[0].created_at
				const updatedDate = userResults[0].updated_at
				const username = userResults[0].username
				const user_id = userResults[0].user_id
				const driverSearch = 'SELECT * FROM drivers WHERE user_id = ?';
				const driver_query = mysql.format(driverSearch,[user_id])
				db.query(driver_query, async (err,driverResults) => {
					if (err) {
						console.error(err);
						return res.status(500).json({error: "Database Error"});
					}
					if (userResults.length === 0) {
						console.log("User doesn't exist.")
						return res.status(404).json({error: "User not found"});
					} else {
						const first_name = driverResults[0].first_name
						const last_name = driverResults[0].last_name
						const phone = driverResults[0].phone_number
						return res.json({
							role: role, isActive: isActive, createDate: createDate, updatedDate: updatedDate,
							username: username, email: email, user_id:user_id, first_name:first_name, last_name:last_name, phone:phone
						})
					}
				});
			}
		}
	})
})

app.post("/UpdateUser", (req, res) => {
	const newValue = req.body.newValue
	const toUpdate = req.body.toUpdate
	const token = req.body.key
	const email = decodeAccessToken(token)
	const user_id = req.body.user_id
	const role = req.body.role

	if (toUpdate === "username") {
		const sqlInsert = "update users set username = ? where email = ?"
		const insert_query = mysql.format(sqlInsert, [newValue, email])
		db.query(insert_query, async (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({error: "Database Error"});
			} else {
				return res.json({success:true})
			}
		})
	}
	else if (toUpdate === "email") {
		const sqlInsert = "update users set email = ? where user_id = ?"
		const insert_query = mysql.format(sqlInsert, [newValue, user_id])
		db.query(insert_query, async (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({error: "Database Error"});
			} else {
				return res.ok
			}
		})
	}
	else if (role === "driver") {
		let sql;
		switch (toUpdate) {
			case "first_name":
				sql = "UPDATE drivers SET first_name = ? WHERE user_id = ?";
				break;
			case "last_name":
				sql = "UPDATE drivers SET last_name = ? WHERE user_id = ?";
				break;
			case "phone_number":
				sql = "UPDATE drivers SET phone_number = ? WHERE user_id = ?";
				break;
			default:
				return res.status(400).json({ error: "Invalid field" });
		}
		const query = mysql.format(sql, [newValue, user_id]);
		db.query(query, (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: "Database Error" });
			}
			return res.json({ success: true });
		});
	}
	else if (role === "sponsor") {
		let sql;
		switch (toUpdate) {
			case "first_name":
				sql = "UPDATE sponsor_users SET first_name = ? WHERE user_id = ?";
				break;
			case "last_name":
				sql = "UPDATE sponsor_users SET last_name = ? WHERE user_id = ?";
				break;
			case "phone_number":
				sql = "UPDATE sponsor_users SET phone_number = ? WHERE user_id = ?";
				break;
			default:
				return res.status(400).json({ error: "Invalid field" });
		}
		const query = mysql.format(sql, [newValue, user_id]);
		db.query(query, (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: "Database Error" });
			}
			return res.json({ success: true });
		});
	}
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
			const sqlSearch2 = "select * from driver_sponsors where sponsor_id = ?"
			const search_query2 = mysql.format(sqlSearch2, [sponsorID])
			db.query(search_query2, async (err, driverResults2) => {
				if (err) {
					console.error(err);
					return res.status(500).json({error: "Database Error"});
				}
				if (driverResults2.length === 0) {
					console.log("No drivers")
					return res.status(404).json({error: "There are no drivers for this sponsor"});
				} else {
					const results2Map = Object.fromEntries(
						driverResults2.map(d => [d.driver_id, d])
					);
					return res.json(driverResults.map(d => {
						const d2 = results2Map[d.driver_id];
						return {
							driver_id: d.driver_id,
							firstname: d.first_name,
							lastname: d.last_name,
							phone: d.phone_number,
							points: d2 ? d2.points : null,
							createDate: d.created_at,
							updatedDate: d.updated_at
						}
					}));
				}
			})
		}
	})
})


//get info of a sponsor from a token
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
	const reason = req.body.reason

	const update = "UPDATE driver_sponsors SET points = points + ? WHERE driver_id = ? and sponsor_id = ?"
	const update_query = mysql.format(update, [change, driverID, sponsor_id])
	db.query(update_query, async (err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: "Database Error"});
		} else {
			insert = "INSERT INTO driver_points (driver_id, sponsor_id, points_change, reason) VALUES (?, ?, ?, ?);"
			insert_query = mysql.format(insert, [driverID, sponsor_id, change, reason])
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

app.post('/getPointsValue', (req, res) => {
	const sponsor_id = req.body.sponsor_id
	console.log("Sponsor id for points value")
	console.log(sponsor_id)

	const get = "select * from sponsors where sponsor_id = ?"
	const get_query = mysql.format(get, [sponsor_id])
	db.query(get_query, async (err, getResults) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: "Database Error"});
		}
		if (getResults.length === 0) {
			console.log("No sponsor with that id")
			return res.status(404).json({error: "No sponsor with that id"});
		} else {
			const point_value_usd = getResults[0].point_value_usd
			return res.json({point_value_usd:point_value_usd})
		}
	})
})

app.post('/changePointsValue', (req, res) => {
	const sponsor_id = req.body.sponsor_id
	const value = req.body.value

	const update = "UPDATE sponsors SET point_value_usd = ? WHERE sponsor_id = ?"
	const update_query = mysql.format(update, [value, sponsor_id])
	db.query(update_query, async (err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: "Database Error"});
		} else {
			return res.status(200).json({success:true})
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
				//console.log(`Password reset token created for ${email}`);
				//console.log(`Reset URL: http://localhost:5173/reset-password?token=${resetToken}`);
				const resetURL = `https://team03.cpsc4911.com/reset-password?token=${resetToken}`;


				transporter.sendMail({
					from: process.env.EMAIL_USER,
					to: email,
					subject: 'Password Reset - Good Driver Incentive Program',
					html: `
						<h2>Password Reset Request</h2>
						<p>Click the link below to reset your password:</p>
						<a href="${resetURL}">${resetURL}</a>
						<p>This link expires in 30 minutes.</p>
						<p>If you did not request this, ignore this email.</p>
					`
				}, (err) => {
					if (err) console.error('Email failed:', err);
				});

				res.json(successResponse);
			}
		);
	});
});

//adding something to the sponsor catalog
app.post('/api/add-to-catalog', async (req, res) => {
	const {sponsor_id, listing_id} = req.body;
	const formattedId = `,${listing_id}`;
	const query = 'UPDATE sponsors SET catalog = CONCAT (catalog, ?) WHERE sponsor_id = ?';
	db.query(query, [formattedId, sponsor_id], async (err, results) => {
		if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Failed to update catalog" });
        }


        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Sponsor not found" });
        }

       
        return res.status(200).json({ success: true, message: "Catalog updated" });
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

							// log password changes
							db.query(
								'INSERT INTO password_logs (user_id) VALUES (?)',
								[resetRecord.user_id],
								(logErr) => {
									if (logErr) console.error('Failed to log password change:', logErr);
									res.json({ success: true, message: "Password reset was successful!" });
								}
							);
						}
					);
				}
			);
		});
});

// create new user route
app.post('/api/admin/users', async (req, res) => {
    const { email, password, role_type, first_name, last_name, sponsor_id, phone_number } = req.body;

    if (!email || !password || !role_type) {
        return res.status(400).json({ error: 'All fields required' });
    }

    if (!['driver', 'sponsor', 'admin'].includes(role_type)) {
        return res.status(400).json({ error: 'Invalid role type' });
    }

    if (password.length < 10) {
        return res.status(400).json({ error: 'Password must be at least 10 characters' });
    }

    if (role_type === 'sponsor' || role_type === 'driver') {
        if (!first_name || !String(first_name).trim()) {
            return res.status(400).json({ error: 'First name is required' });
        }
        if (!last_name || !String(last_name).trim()) {
            return res.status(400).json({ error: 'Last name is required' });
        }
    }

    const fn = first_name != null ? String(first_name).trim() : '';
    const ln = last_name != null ? String(last_name).trim() : '';
    const phoneVal =
        phone_number != null && String(phone_number).trim() !== ''
            ? String(phone_number).trim().slice(0, 25)
            : null;

    let sponsorSid = null;
    if (role_type === 'sponsor') {
        sponsorSid = parseInt(sponsor_id, 10);
        if (Number.isNaN(sponsorSid) || sponsorSid < 1) {
            return res.status(400).json({ error: 'Sponsor organization is required for sponsor accounts' });
        }
    }

    const finishProfiles = (newUserId) => {
        if (role_type === 'sponsor') {
            const sponsorQuery =
                'INSERT INTO sponsor_users (user_id, sponsor_id, first_name, last_name, phone_number, is_active) VALUES (?, ?, ?, ?, ?, 1)';
            db.query(sponsorQuery, [newUserId, sponsorSid, fn, ln, phoneVal], (err2) => {
                if (err2) {
                    console.error(err2);
                    return res.status(500).json({
                        error: 'User created but sponsor_users row could not be inserted',
                    });
                }
                return res.json({
                    success: true,
                    message: 'Sponsor user created and linked to organization',
                    user_id: newUserId,
                    sponsor_id: sponsorSid,
                });
            });
            return;
        }
        if (role_type === 'driver') {
            const driverQuery = 'INSERT INTO drivers (user_id, first_name, last_name) VALUES (?, ?, ?)';
            db.query(driverQuery, [newUserId, fn, ln], (err2) => {
                if (err2) {
                    console.error(err2);
                    return res.status(500).json({ error: 'User created but driver profile failed' });
                }
                return res.json({
                    success: true,
                    message: 'Driver user created successfully',
                    user_id: newUserId,
                });
            });
            return;
        }
        return res.json({
            success: true,
            message: 'User created successfully',
            user_id: newUserId,
        });
    };

    const runInsertUser = (hashedPassword) => {
        db.query(
            'INSERT INTO users (email, password_hash, role_type, is_active) VALUES (?, ?, ?, 1)',
            [email, hashedPassword, role_type],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    console.error(err);
                    return res.status(500).json({ error: 'Database error' });
                }
                finishProfiles(result.insertId);
            }
        );
    };

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role_type === 'sponsor') {
            db.query(
                'SELECT sponsor_id FROM sponsors WHERE sponsor_id = ? AND is_active = 1 LIMIT 1',
                [sponsorSid],
                (chkErr, srows) => {
                    if (chkErr) {
                        console.error(chkErr);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    if (!srows.length) {
                        return res.status(400).json({ error: 'Invalid or inactive sponsor organization' });
                    }
                    runInsertUser(hashedPassword);
                }
            );
            return;
        }

        runInsertUser(hashedPassword);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
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
            (SELECT COUNT(*) FROM sponsors WHERE is_active = 1) as totalSponsors,
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

// Current driver's point balance (navbar, etc.)
app.get('/api/me/points', (req, res) => {
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
			const rt = String(urows[0].role_type ?? '')
				.trim()
				.toLowerCase();
			if (rt !== 'driver') {
				return res.status(403).json({ error: 'Only drivers have a point balance' });
			}
			const userId = urows[0].user_id;
			db.query(
				'SELECT total_points FROM drivers WHERE user_id = ? LIMIT 1',
				[userId],
				(e2, drows) => {
					if (e2) {
						console.error(e2);
						return res.status(500).json({ error: 'Database error' });
					}
					if (!drows.length) {
						return res.json({ points: 0 });
					}
					const raw = drows[0].total_points;
					const n = raw == null ? 0 : Number(raw);
					return res.json({ points: Number.isFinite(n) ? n : 0 });
				}
			);
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
								//res.json({ success: true });

								// link approved drivers to sponsors
								if (application_status === 'APPROVED') {
									db.query (
										`UPDATE drivers SET sponsor_id = ?, phone_number = ? WHERE user_id = ?`,
										[row.sponsor_id, row.phone_number, row.user_id],
										(e4) => {
											if (e4) console.error('Failed to link this driver to sponsor.', e4);
											res.json({ success: true, message: 'Application approved and driver linked to sponsor' });
										}
									);
								}
								else {
									res.json({success: true});
								}
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

// add sponsor organization
app.post('/api/admin/sponsors', (req, res) => {
    const { company_name, point_value_usd } = req.body;

    if (!company_name) {
        return res.status(400).json({ error: 'Company name required' });
    }

    db.query(
        'INSERT INTO sponsors (company_name, point_value_usd, is_active) VALUES (?, ?, 1)',
        [company_name, point_value_usd || 0.0100],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Organization already exists' });
                }
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, sponsor_id: result.insertId });
        }
    );
});

// recent activities
app.get('/api/admin/recent-activity', async(req,res) => {
	const sql = `
	SELECT 'login' AS type, username AS label, success, attempted_at AS timestamp
    FROM login_attempts
    UNION ALL
    SELECT 'application' AS type,
        CONCAT(da.first_name, ' ', da.last_name, ' applied to ', s.company_name) AS label,
        NULL AS success, da.created_at AS timestamp
    FROM driver_applications da
    JOIN sponsors s ON da.sponsor_id = s.sponsor_id
    UNION ALL
    SELECT 'points' AS type,
        CONCAT(d.first_name, ' ', d.last_name, ' (', dp.points_change, ' pts)') AS label,
        NULL AS success, dp.created_at AS timestamp
    FROM driver_points dp
    JOIN drivers d ON dp.driver_id = d.driver_id
    ORDER BY timestamp DESC
    LIMIT 10
`;
db.query(sql, (err,results) => {
	if (err) {
		console.error(err);
		return res.status(500).json({error: 'Database error!'});
	}
	res.json(results);
});
});

// audit log endpoint
app.get('/api/admin/audit-log',async (req,res) => {
	const type = req.query.type || 'all';
	
	let sql = '';

	if (type == 'login') {
		sql = `SELECT 'login' AS type, username AS label, success, attempted_at AS timestamp
		FROM login_attempts
		ORDER BY timestamp DESC LIMIT 50`;
	}
	else if (type === 'application') {
		sql = `SELECT 'application' AS type,
		CONCAT(da.first_name, ' ', da.last_name, ' applied to ', s.company_name) AS label,
		NULL AS success, da.created_at AS timestamp
		FROM driver_applications da
		JOIN sponsors s ON da.sponsor_id = s.sponsor_id
		ORDER BY timestamp DESC LIMIT 50`;
	}
	else if (type === 'points') {
		sql = `SELECT 'points' AS type,
		CONCAT(d.first_name, ' ', d.last_name, ' (', dp.points_change, ' pts)') AS label,
		NULL AS success, dp.created_at AS timestamp
		FROM driver_points dp
		JOIN drivers d ON dp.driver_id = d.driver_id
		ORDER BY timestamp DESC LIMIT 50`;
	}
	else if (type === 'password') {
		sql = `SELECT 'password' AS type,
		CONCAT('Password changed for user #', pl.user_id) AS label,
		NULL AS success, pl.changed_at AS timestamp
		FROM password_logs pl
		ORDER BY timestamp DESC LIMIT 50`;
	}
	else {
		sql = `SELECT 'login' AS type, username AS label, success, attempted_at AS timestamp
		FROM login_attempts
		UNION ALL
		SELECT 'application' AS type,
		CONCAT(da.first_name, ' ', da.last_name, ' applied to ', s.company_name) AS label,
		NULL AS success, da.created_at AS timestamp
		FROM driver_applications da
		JOIN sponsors s ON da.sponsor_id = s.sponsor_id
		UNION ALL
		SELECT 'points' AS type,
		CONCAT(d.first_name, ' ', d.last_name, ' (', dp.points_change, ' pts)') AS label,
		NULL AS success, dp.created_at AS timestamp
		FROM driver_points dp
		JOIN drivers d on dp.driver_id = d.driver_id
		UNION ALL
		SELECT 'password' AS type,
		CONCAT('Password changed for user #', pl.user_id) AS label,
		NULL AS success, pl.changed_at AS timestamp
		FROM password_logs pl
		ORDER BY timestamp DESC LIMIT 50`;	
	}
	db.query(sql, (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({error: 'Database error!'});
		}
		res.json(results);
});
});

// bulk upload endpoint
app.post('/api/admin/bulk-upload', async (req, res) => {
    const { rows } = req.body;
    if (!rows || !Array.isArray(rows)) {
        return res.status(400).json({ error: 'No rows provided' });
    }

    let created = 0;
    const errors = [];

    // Pass 1 - process O rows first to build org map
    const orgMap = {};
    for (const { line, content } of rows) {
        const parts = content.split('|');
        if (parts[0].toUpperCase() !== 'O') continue;

        const company_name = parts[1]?.trim();
        if (!company_name) {
            errors.push({ line, content, reason: 'Organization name is required' });
            continue;
        }

        // check if org already exists
        const existing = await new Promise((resolve) => {
            db.query('SELECT sponsor_id FROM sponsors WHERE company_name = ?', [company_name], (err, results) => {
                resolve(err ? null : results);
            });
        });

        if (existing && existing.length > 0) {
            orgMap[company_name] = existing[0].sponsor_id;
            continue;
        }

        const result = await new Promise((resolve) => {
            db.query(
                'INSERT INTO sponsors (company_name, point_value_usd, is_active) VALUES (?, 0.01, 1)',
                [company_name],
                (err, result) => resolve(err ? null : result)
            );
        });

        if (!result) {
            errors.push({ line, content, reason: 'Failed to create organization' });
            continue;
        }

        orgMap[company_name] = result.insertId;
        created++;
    }

    // Pass 2 - process D and S rows
    for (const { line, content } of rows) {
        const parts = content.split('|');
        const type = parts[0].toUpperCase();

        if (type === 'O') continue;

        if (type === 'D') {
            const org = parts[1]?.trim();
            const first_name = parts[2]?.trim();
            const last_name = parts[3]?.trim();
            const email = parts[4]?.trim();
            const points = parts[5]?.trim();
            const reason = parts[6]?.trim();

            if (!org || !first_name || !last_name || !email) {
                errors.push({ line, content, reason: 'Missing required fields (org, first name, last name, email)' });
                continue;
            }

            const sponsor_id = orgMap[org];
            if (!sponsor_id) {
                errors.push({ line, content, reason: `Organization "${org}" not found` });
                continue;
            }

            if (points && !reason) {
                errors.push({ line, content, reason: 'Points provided but reason is missing' });
                continue;
            }

            // check if user already exists
            const existingUser = await new Promise((resolve) => {
                db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, results) => {
                    resolve(err ? null : results);
                });
            });

            let user_id;
            if (existingUser && existingUser.length > 0) {
                user_id = existingUser[0].user_id;
            } else {
                const tempPassword = await bcrypt.hash('ChangeMe123!', 10);
                const newUser = await new Promise((resolve) => {
                    db.query(
                        'INSERT INTO users (email, password_hash, role_type, is_active) VALUES (?, ?, "driver", 1)',
                        [email, tempPassword],
                        (err, result) => resolve(err ? null : result)
                    );
                });

                if (!newUser) {
                    errors.push({ line, content, reason: 'Failed to create user account' });
                    continue;
                }

                user_id = newUser.insertId;

                await new Promise((resolve) => {
                    db.query(
                        'INSERT INTO drivers (user_id, first_name, last_name) VALUES (?, ?, ?)',
                        [user_id, first_name, last_name],
                        (err) => resolve(!err)
                    );
                });

                created++;
            }


            // add points if provided
            if (points && reason) {
                const driver = await new Promise((resolve) => {
                    db.query('SELECT driver_id FROM drivers WHERE user_id = ?', [user_id], (err, results) => {
                        resolve(err ? null : results);
                    });
                });

                if (driver && driver.length > 0) {
                    const driver_id = driver[0].driver_id;
                    await new Promise((resolve) => {
                        db.query(
                            'UPDATE drivers SET total_points = total_points + ? WHERE driver_id = ?',
                            [parseInt(points), driver_id],
                            (err) => resolve(!err)
                        );
                    });
                    await new Promise((resolve) => {
                        db.query(
                            'INSERT INTO driver_points (driver_id, sponsor_id, points_change, reason) VALUES (?, ?, ?, ?)',
                            [driver_id, sponsor_id, parseInt(points), reason],
                            (err) => resolve(!err)
                        );
                    });
                }
            }

        } else if (type === 'S') {
            const org = parts[1]?.trim();
            const first_name = parts[2]?.trim();
            const last_name = parts[3]?.trim();
            const email = parts[4]?.trim();

            if (!org || !first_name || !last_name || !email) {
                errors.push({ line, content, reason: 'Missing required fields (org, first name, last name, email)' });
                continue;
            }

            const sponsor_id = orgMap[org];
            if (!sponsor_id) {
                errors.push({ line, content, reason: `Organization "${org}" not found` });
                continue;
            }

            const existingUser = await new Promise((resolve) => {
                db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, results) => {
                    resolve(err ? null : results);
                });
            });

            if (existingUser && existingUser.length > 0) {
                errors.push({ line, content, reason: 'Email already exists' });
                continue;
            }

            const tempPassword = await bcrypt.hash('ChangeMe123!', 10);
            const newUser = await new Promise((resolve) => {
                db.query(
                    'INSERT INTO users (email, password_hash, role_type, is_active) VALUES (?, ?, "sponsor", 1)',
                    [email, tempPassword],
                    (err, result) => resolve(err ? null : result)
                );
            });

            if (!newUser) {
                errors.push({ line, content, reason: 'Failed to create user account' });
                continue;
            }

            await new Promise((resolve) => {
                db.query(
                    'INSERT INTO sponsor_users (user_id, sponsor_id, first_name, last_name, is_active) VALUES (?, ?, ?, ?, 1)',
                    [newUser.insertId, sponsor_id, first_name, last_name],
                    (err) => resolve(!err)
                );
            });

            created++;
        } else {
            errors.push({ line, content, reason: `Unknown row type "${parts[0]}"` });
        }
    }

    res.json({ created, updated: 0, errors });
});

// sponsor bulk upload enpoint
app.post('/api/sponsor/bulk-upload', async (req,res) => {
	const  {rows} = req.body;
	const token = getBearerToken(req);

	if (!token) return res.status(401).json({error: 'Authorization is required!'});
	if (!rows || !Array.isArray(rows)) return res.status(400).json({error: 'No rows provided or invalid format!'});

	const email = decodeAccessToken(token);

	// get sponsor id from the token
	const sponsorUser = await new Promise((resolve ) => {
		db.query(
			`SELECT sa.sponsor_id FROM users s
			JOIN sponsor_users sa on s.user_id = sa.user_id
			WHERE  s.email = ? LIMIT 1`,
			[email],
			(err, results) => resolve(err ? null : results)

		);
	});

	if (!sponsorUser || sponsorUser.length === 0) {
		return res.status(403).json({ error: 'Sponsor organization could not be found.' });
	}

	const sponsor_id = sponsorUser[0].sponsor_id;
	let created = 0;
	const errors = [];

	for (const { line, content } of rows) {
		const parts = content.split('|');
		const type = parts[0].toUpperCase();

		// ensure 0 type not allowed
		if (type === "O") {
			errors.push({ line, content, reason: 'Organization rows are not allowed in sponsor uploads' });
			continue;
		}

		if (type === 'D') {
			const first_name = parts[1]?.trim();
			const last_name = parts[2] ?.trim();
			const email = parts[3]?.trim();
			const points = parts[4]?.trim();
			const reason = parts[5]?.trim();

			// check for missing fields
			if (!first_name || !last_name || !email) {
				errors.push({ line, content, reason: 'Missing required fields!' });
				continue;
			}

			// check for missing reason
			if (points && !reason) {
				errors.push({ line, content, reason: 'Missing reason field!' });
				continue;
			}

			// make sure that user exists
			const existingUser = await new Promise((resolve) => {
				db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, results) => {
					resolve(err ? null : results);

				});
			});
			let user_id;
            if (existingUser && existingUser.length > 0) {
                user_id = existingUser[0].user_id;

                // update points if provided
                if (points && reason) {
                    const driver = await new Promise((resolve) => {
                        db.query('SELECT driver_id FROM drivers WHERE user_id = ?', [user_id], (err, results) => {
                            resolve(err ? null : results);
                        });
                    });

                    if (driver && driver.length > 0) {
                        const driver_id = driver[0].driver_id;
                        await new Promise((resolve) => {
                            db.query(
                                'UPDATE drivers SET total_points = total_points + ? WHERE driver_id = ?',
                                [parseInt(points), driver_id],
                                (err) => resolve(!err)
                            );
                        });
                        await new Promise((resolve) => {
                            db.query(
                                'INSERT INTO driver_points (driver_id, sponsor_id, points_change, reason) VALUES (?, ?, ?, ?)',
                                [driver_id, sponsor_id, parseInt(points), reason],
                                (err) => resolve(!err)
                            );
                        });
                    }
                }
            } 
			else {
                const tempPassword = await bcrypt.hash('ChangeMe123!', 10);
                const newUser = await new Promise((resolve) => {
                    db.query(
                        'INSERT INTO users (email, password_hash, role_type, is_active) VALUES (?, ?, "driver", 1)',
                        [email, tempPassword],
                        (err, result) => resolve(err ? null : result)
                    );
                });

                if (!newUser) {
                    errors.push({ line, content, reason: 'Failed to create user account' });
                    continue;
                }

                user_id = newUser.insertId;

                await new Promise((resolve) => {
                    db.query(
                        'INSERT INTO drivers (user_id, first_name, last_name) VALUES (?, ?, ?)',
                        [user_id, first_name, last_name],
                        (err) => resolve(!err)
                    );
                });

                created++;

                if (points && reason) {
                    const driver = await new Promise((resolve) => {
                        db.query('SELECT driver_id FROM drivers WHERE user_id = ?', [user_id], (err, results) => {
                            resolve(err ? null : results);
                        });
                    });

                    if (driver && driver.length > 0) {
                        const driver_id = driver[0].driver_id;
                        await new Promise((resolve) => {
                            db.query(
                                'UPDATE drivers SET total_points = total_points + ? WHERE driver_id = ?',
                                [parseInt(points), driver_id],
                                (err) => resolve(!err)
                            );
                        });
                        await new Promise((resolve) => {
                            db.query(
                                'INSERT INTO driver_points (driver_id, sponsor_id, points_change, reason) VALUES (?, ?, ?, ?)',
                                [driver_id, sponsor_id, parseInt(points), reason],
                                (err) => resolve(!err)
                            );
                        });
                    }
                }
            }

        } 
		else if (type === 'S') {
            const first_name = parts[1]?.trim();
            const last_name = parts[2]?.trim();
            const email = parts[3]?.trim();
            const points = parts[4]?.trim();

            if (!first_name || !last_name || !email) {
                errors.push({ line, content, reason: 'Missing required fields (first name, last name, email)' });
                continue;
            }

            //  points not allowed for sponsor users, but still create user if they don't exist
            if (points) {
                errors.push({ line, content, reason: 'Points cannot be assigned to sponsor users' });
            
            }

            const existingUser = await new Promise((resolve) => {
                db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, results) => {
                    resolve(err ? null : results);
                });
            });

            if (existingUser && existingUser.length > 0) continue;

            const tempPassword = await bcrypt.hash('ChangeMe123!', 10);
            const newUser = await new Promise((resolve) => {
                db.query(
                    'INSERT INTO users (email, password_hash, role_type, is_active) VALUES (?, ?, "sponsor", 1)',
                    [email, tempPassword],
                    (err, result) => resolve(err ? null : result)
                );
            });

            if (!newUser) {
                errors.push({ line, content, reason: 'Failed to create user account' });
                continue;
            }

            await new Promise((resolve) => {
                db.query(
                    'INSERT INTO sponsor_users (user_id, sponsor_id, first_name, last_name, is_active) VALUES (?, ?, ?, ?, 1)',
                    [newUser.insertId, sponsor_id, first_name, last_name],
                    (err) => resolve(!err)
                );
            });

            created++;

        } 
		else {
            errors.push({ line, content, reason: `Unknown row type "${parts[0]}"` });
        }
    }

    res.json({ created, updated: 0, errors });
});

//this creats a notification in the database and sends to to a phone number
async function CreateNotification(token, message){
	/*const messageClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
	const phoneNumber = '+18436310882'
	const email = decodeAccessToken(token)

	//get the phone number from email 

	//create new notification for the database*/
	db.query('INSERT INTO notifications (message) VALUES (?)', [message], (err, purchaseResults) => {
	});
};


//purchase your cart as a driver
app.post('/api/purchase', async (req, res) => {
	const token = req.body.key
	const total = req.body.total
	const email = decodeAccessToken(token)

	//get the user_id from email
	db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, userResults) => {
		if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Error with database" });
        }
        if (userResults.length === 0) {
            return res.status(404).json({ error: "user not found not found" });
        }

		const user_id = userResults[0].user_id;
		//get the info we need from the driver table
		db.query('SELECT * FROM drivers WHERE user_id = ?', [user_id], (err, driverResults) => {

			const points = driverResults[0].total_points;
			const cart = driverResults[0].cart;

			//check if the purchase can be made
			if (points - total < 0){
				return res.status(403).json({ error: "You do not have enough points"});

			}else{
				//if the points are enough make a new purchase in table
				db.query('INSERT INTO purchases (user_id, cost, cart) VALUES (?, ?, ?)', [user_id, total, cart], (err, purchaseResults) => {
					
					//then we need to update the driver table
					db.query('UPDATE drivers SET cart = "", total_points = ? WHERE user_id = ?', [points - total, user_id], (err, finalResults) => {

						CreateNotification(token, `Thanks for your purchase of ${total} points!`)
						.then(() => console.log("SMS Sent"))
						.catch(e => console.error("SMS failed", e));
						return res.status(200).json({ success: true, message: "Purchase Completed" });
					})
				});
			}
		});

	});
})

// sponsor point reports
app.get('/api/sponsor/points-report', async (req, res) => {
	const token = getBearerToken(req);
	if (!token) return res.status(401).json({ error: 'Authorization is required!' });

	const email = decodeAccessToken(token);

	const sponsorUser = await new Promise((resolve) => {
		// query sponsor users 
		db.query(
			`SELECT sa.sponsor_id FROM users s
			JOIN sponsor_users sa on s.user_id = sa.user_id
			WHERE  s.email = ? LIMIT 1`,
			[email],
			(err, results) => resolve(err ? null : results)
		);
	});

	if (!sponsorUser || sponsorUser.length === 0) {
		return res.status(403).json({ error: 'Sponsor organization was not found.' });
	}

	const sponsor_id = sponsorUser[0].sponsor_id;

	// query driver points
	const sql = `
	SELECT
		d.driver_id,
		CONCAT(d.first_name, ' ', d.last_name) AS driver_name,
		d.total_points,
		dp.points_change,
		dp.reason,
		dp.created_at AS date,
		s.company_name AS sponsor_name
	FROM driver_points dp
	JOIN drivers d ON dp.driver_id = d.driver_id
	JOIN sponsors s ON dp.sponsor_id = s.sponsor_id
	WHERE s.sponsor_id = ?
	ORDER BY dp.created_at DESC
	`;

	db.query(sql, [sponsor_id], (err, results) => { 
		if (err) {
			console.error(err);
			return res.status(500).json({ error: 'Database error.' });
		}
		res.json(results);
	});
});

// admin sales by sponsor report
app.get('/api/admin/sales-by-sponsor', (req,res) => {
	const sql = `
	SELECT
		s.company_name AS sponsor_name,
		CONCAT(d.first_name, ' ', d.last_name) AS driver_name,
		dp.points_change,
		dp.reason,
		dp.created_at AS date
	FROM driver_points dp
	JOIN sponsors s ON dp.sponsor_id = s.sponsor_id
	JOIN drivers d ON dp.driver_id = d.driver_id
	ORDER BY dp.created_at DESC
	`;

	db.query(sql, (err, results) => {
		if(err) {
			console.error(err);
			return res.status(500).json({ error: 'Database error.' });
		}
		res.json(results);
	});


});

// admin sales by driver
app.get('/api/admin/sales-by-driver', (req, res) => {
	const sql = `
	SELECT
	CONCAT(d.first_name, ' ' , d.last_name) AS driver_name,
	s.company_name as sponsor_name,
	dp.points_change,
	dp.reason,
	dp.created_at AS date
	FROM driver_points dp
	JOIN drivers d ON dp.driver_id = d.driver_id
	JOIN sponsors s on dp.sponsor_id = s.sponsor_id
	ORDER BY dp.created_at DESC
	`;

	db.query(sql, (err, results) => {
		if(err) {
			console.error(err);
			return res.status(500).json({ error: 'Database error.' });
		}
		res.json(results);
	});
});

// sponsor audit log
app.get('/api/sponsor/audit-log', async (req,res) => {
	const token = getBearerToken(req);
	if (!token) return res.status(401).json({ error: 'Authorization is required!' });

	const email = decodeAccessToken(token);
	const type = req.query.type || 'all';

	const sponsorUser = await new Promise((resolve) =>{
		db.query(
			`SELECT s.sponsor_id FROM users u
			JOIN sponsor_users s ON u.user_id = s.user_id
			WHERE u.email = ? LIMIT 1`,
			[email],
			(err, results) => resolve(err ? null : results)
		);

	});

	if (!sponsorUser || sponsorUser.length === 0) {
		return res.status(403).json({ error: 'Sponsor organization was not found.' });
	}

	const sponsor_id = sponsorUser[0].sponsor_id;
	let sql = '';
	let params = [];

	if (type === 'application') {
		sql = `SELECT 'application' AS type,
			CONCAT(da.first_name, ' ', da.last_name, ' applied to ', s.company_name) AS label,
            NULL AS success, da.created_at AS timestamp
            FROM driver_applications da
            JOIN sponsors s ON da.sponsor_id = s.sponsor_id
            WHERE da.sponsor_id = ?
            ORDER BY da.created_at DESC LIMIT 50`;
		params = [sponsor_id];
	}

	else if (type === 'points') {
		sql = `SELECT 'points' AS type,
			CONCAT(d.first_name, ' ', d.last_name, ' (', dp.points_change, ' pts)') AS label,
			NULL AS success , dp.created_at AS timestamp
            FROM driver_points dp
            JOIN drivers d ON dp.driver_id = d.driver_id
            WHERE dp.sponsor_id = ?
            ORDER BY dp.created_at DESC LIMIT 50`;
		params = [sponsor_id];
	}

	else {
		sql = `SELECT 'application' AS type,
            CONCAT(da.first_name, ' ', da.last_name, ' applied to ', s.company_name) AS label,
            NULL AS success, da.created_at AS timestamp
            FROM driver_applications da
            JOIN sponsors s ON da.sponsor_id = s.sponsor_id
            WHERE da.sponsor_id = ?
            UNION ALL
            SELECT 'points' AS type,
            CONCAT(d.first_name, ' ', d.last_name, ' (', dp.points_change, ' pts)') AS label,
            NULL AS success, dp.created_at AS timestamp
            FROM driver_points dp
            JOIN drivers d ON dp.driver_id = d.driver_id
            WHERE dp.sponsor_id = ?
            ORDER BY timestamp DESC LIMIT 50`;
        params = [sponsor_id, sponsor_id];
	}

	db.query(sql, params, (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: 'Database error.' });
		}
		res.json(results);
	});

});

// sponsor stats endpoint
app.get('/api/sponsor/stats', async (req,res) => {
	const token = getBearerToken(req);
	if(!token) return res.status(401).json({ error: 'Authorization is required!' });


const email = decodeAccessToken(token);

const sponsorUser = await new Promise((resolve) => {
	db.query(
		`SELECT su.sponsor_id FROM users u
		JOIN sponsor_users su ON u.user_id = su.user_id
		WHERE u.email = ? LIMIT 1`,
		[email],
		(err, results) => resolve(err ? null : results)
	);
});

// check if sponsor user exists
if (!sponsorUser || sponsorUser.length === 0) {
	return res.status(403).json({ error: 'Sponsor organization was not found.' });
}

const sponsor_id = sponsorUser[0].sponsor_id;

const sql =`
SELECT
    (SELECT COUNT(*) FROM drivers WHERE sponsor_id = ?) as totalDrivers,
    (SELECT COUNT(*) FROM drivers WHERE sponsor_id = ?) as activeDrivers,
    (SELECT COUNT(*) FROM driver_applications WHERE sponsor_id = ? AND application_status = 'PENDING') as pendingApplications,
    (SELECT COALESCE(SUM(points_change), 0) FROM driver_points WHERE sponsor_id = ? AND points_change > 0) as totalPointsAwarded
	`;

	db.query(sql, [sponsor_id, sponsor_id, sponsor_id, sponsor_id], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: 'Database error.' });
		}
		res.json ({
			totalDrivers: results[0].totalDrivers || 0,
			activeDrivers: results[0].activeDrivers || 0,
			pendingApplications: results[0].pendingApplications || 0,
			totalPointsAwarded: results[0].totalPointsAwarded || 0
		});
	});

});

// admin impersonating endpoint
app.post('/api/admin/impersonate/:user_id', (req,res) => {
	const token = getBearerToken(req);
	if (!token) return res.status(401).json({error: 'Authorization is required!'});

	const email = decodeAccessToken(token);
	if(!email) return res.status(401).json({error: 'Invalid or expired token!'});

	// check if requester is an admin user
	db.query(
		`SELECT role_type FROM users WHERE email = ? AND is_active = 1 LIMIT 1`,
		[email],
		(err, rows) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: 'Database error!' });
			}
			if (!rows.length || rows[0].role_type !== 'admin') {
				return res.status(403).json({ error: 'Access denied! This feature is for admins only' });
			}

			// get target user information
			db.query (
				`SELECT user_id, email, role_type FROM users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
				[req.params.user_id],
				(err2, userRows) => {
					if (err2) {
						console.error(err2);
						return res.status(500).json({ error: 'Database error!' });
					}
					if (!userRows.length){
						return res.status(404).json({ error: 'Target user not found!' });
					}
					const targetUser = userRows[0];

					if (targetUser.role_type === 'admin') {
						return res.status(400).json({ error: 'Cannot impersonate another admin user!' });
					}
					const impersonateToken = generateAccessToken({
						user : targetUser.email,
						role : targetUser.role_type
					});
					res.json ({
						impersonateToken,
						role : targetUser.role_type,
						email : targetUser.email
					});
				}
			);
		}
	);
});

// sponsor impersonatation - drivers
app.post('/api/sponsor/impersonate/:driver_id', (req,res) => {
	const token = getBearerToken(req);
	if (!token) {
		return res.status(401).json({ error: 'Authorization is required!' });
	}

	const email = decodeAccessToken(token);
	if (!email) {
		return res.status(401).json({ error: 'Invalid or expired token!' });
	}

	// ensure that user is a sponsors
	db.query (
		`SELECT u.user_id, su.sponsor_id FROM users u
		JOIN sponsor_users su ON u.user_id = su.user_id
		WHERE u.email = ? AND u.is_active = 1 LIMIT 1`,
		[email],

		(err,rows) => {
			if(err) {
				console.error(err);
				return res.status(500).json({ error: 'Database error!' });
			}
			if(!rows.length) {
				return res.status(403).json({ error: 'Access denied - User is not a sponsor!' });
			}
			const sponsor_id = rows[0].sponsor_id;

			// check that the targer user belongs to the sponsor
			db.query (
				`SELECT u.user_id, u.email, u.role_type FROM users u
				JOIN drivers d ON u.user_id = d.user_id
				WHERE d.driver_id = ? AND d.sponsor_id = ? AND u.is_active = 1 LIMIT 1`,
				[req.params.driver_id, sponsor_id],
				(err2, driverRows) => {
					if (err2) {
					console.error(err2);
					return res.status(500).json({ error: 'Database error!' });
					}
					if(!driverRows.length) {
						return res.status(404).json({ error: 'Target driver not found or does not belong to your organization!' });
					}

					const targetDriver = driverRows[0];

					const impersonateToken = generateAccessToken({
						user: targetDriver.email,
						role : 'driver'
					});
					res.json({
						impersonateToken,
						role : 'driver',
						email : targetDriver.email
					});
				}
			);
		}
	);

});


//Serve React build
const clientDist = path.join(__dirname, 'client', 'dist');
const fs = require('fs');
const { decode } = require("punycode");
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

//invoice logic
app.get('api/admin/invoice', (req, res) => {
	const sql = `
	SELECT
		b.company_name AS sponsor_name,
		a.purchase_id AS purchase_number,
		a.cost AS amount
	FROM purchases a
	JOIN sponsors b ON a.sponsor_id = b.sponsor_id
	ORDER BY a.purchased_at DESC

	`;


	db.query(sql, (err, results) => {
		if(err) {
			console.error(err);
			return res.status(500).json({ error: 'Database error.' });
		}
		res.json(results);
	});


});