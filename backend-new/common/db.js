const mysql = require("mysql2");

const db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "0404",
  database: "coolmate3",
  charset: "utf8mb4",
});

module.exports = db;