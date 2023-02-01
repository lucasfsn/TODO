const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'todo',
  decimalNumbers: true,
  namedPlaceholders: true,
});

module.exports = {
  pool,
};
