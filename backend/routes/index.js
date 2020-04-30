const express = require('express');
const app = express();

app.use('/books', require('./books'));
app.use('/users', require('./users'));
app.use('/users', require('./login'));

module.exports = app;