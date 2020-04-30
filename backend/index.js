if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');

// Inicializar 
const app = express();

//Settings
app.set('port', process.env.PORT || 3001);

// Middlewares
app.use(morgan('dev'));

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename(req, file, cb) {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  }
});

app.use(multer({ storage }).single('image'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuracion global de rutas. 
app.use('/api', require('./routes/index'));

//Levanto el servirdor
app.listen(app.get('port'), () => {
  console.log(`Servidor en puerto: ${app.get('port')}`);
});
