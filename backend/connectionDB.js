const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.HOSTNAME,
  user: process.env.USERNAMEDB,
  password: process.env.PASSWORD,
  database: 'api-books'
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log('DB is connected!');
})

module.exports = connection;