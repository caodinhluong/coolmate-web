const mysql = require('mysql2');
const db = mysql.createConnection({
	host: 'localhost',
	database: 'coolmate3',
	user: 'root',
	password: '0404'
});
module.exports = db;
