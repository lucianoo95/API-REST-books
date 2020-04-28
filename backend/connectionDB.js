const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.mysqlUri,
  user: process.env.mysqlUsername,
  password: process.env.mysqlPassword,
  database: 'books'
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log('DB is connected!');
})
