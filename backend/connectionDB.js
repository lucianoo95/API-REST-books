const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'bz5dayjowqszqehzyvlx-mysql.services.clever-cloud.com',
  user: 'uugcrrgcleyqooep',
  password: 'knRPtiKzPq6xqO6bExXl',
  database: 'bz5dayjowqszqehzyvlx',
  port: 3306
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log('DB is connected!');
})

module.exports = connection;