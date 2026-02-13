const http = require('http');
const mysql = require("mysql2");

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

        console.log(team_number, version_number, release_date, product_name, product_desc);

        res.statusCode = 200;
        res.setHeader('Content-type', 'text/plain');
        res.end('Product: ' + product_name + '\nVersion:' + version_number + '\nTeam: ' + team_number + '\nRelease Date: ' + release_date + '\nProduct Description: ' + product_desc);
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log('Server running at http://100.51.75.41:5000');
});
