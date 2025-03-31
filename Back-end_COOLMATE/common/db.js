const mysql = require('mysql2');
const db = mysql.createConnection({
	host: 'localhost',
	database: 'coolmate',
	user: 'root',
	password: '0404'
});
module.exports = db;
