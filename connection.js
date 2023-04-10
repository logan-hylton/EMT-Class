var mysql = require('mysql');
const util = require('util');

var pool = mysql.createPool({
  connectionLimit: 4,
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
});

pool.getConnection((err,connection)=> {
  if(err)
    throw err;
  console.log('Database connected successfully');
  connection.release();
});

pool.query = util.promisify(pool.query);
pool.getConnection = util.promisify(pool.getConnection);

module.exports = pool;