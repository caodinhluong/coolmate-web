var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0404',
  database: 'coolmate'
});
connection.connect();

module.exports = router;
