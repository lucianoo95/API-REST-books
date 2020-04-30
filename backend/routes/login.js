const connectDB = require('../connectionDB');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Router } = require('express');
const router = Router();

router.post('/login', (request, response) => {
  const { username, password } = request.body;

  // Query que regresa un usuario si existe. 
  const verifyUserQuery = `select id,username,password from users where username="${username}"`;

  connectDB.query(verifyUserQuery, (error, result) => {
    if (error) {
      response.status(500).json({
        ok: false,
        message: error.message
      })
    }

    // Verifico si el usuario existe en la base de datos.
    if (!result[0]) {
      response.status(400).json({
        ok: false,
        message: '(Usuario) o contraseña incorrectos.'
      })
    }

    // Verifico que la contraseña ingresada en el form coincida con la almacenada en la bd.
    if (!bcrypt.compareSync(password, result[0].password)) {
      response.status(400).json({
        ok: false,
        message: "Usuario o (contraseña) incorrectos."
      })
    }

    // Generar el token
    const token = jwt.sign({
      //Payload(contenido del token)
      user: {
        id: result[0].id,
        username: result[0].username
      }
    }, process.env.SEED, { expiresIn: 60 * 60 * 24 });

    // Retornar token al cliente.
    response.status(200).json({
      ok: true,
      message: `Bienvenido ${result[0].username}`,
      token
    })

  })

})

module.exports = router;