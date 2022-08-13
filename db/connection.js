const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    // unique password, not used for anything else
    password: 'h0tch33tos',
    database: 'directory'
  },
  console.log('Connected to employee database.'),
);

module.exports = db;