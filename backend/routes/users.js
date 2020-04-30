const connectDB = require('../connectionDB');
const { verifyToken } = require('../middlewares/authentication');
const bcrypt = require('bcrypt');
const { Router } = require('express');
const router = Router();

router.post('/create', (request, response) => {
  const { username, email, password } = request.body;
  const createUserQuery = `call createNewUser("${username}","${email}","${bcrypt.hashSync(password, 10)}")`

  connectDB.query(createUserQuery, (error, result) => {
    if (error) {
      response.status(500).json({
        ok: false,
        message: error.message
      })
    }

    response.status(201).json({
      ok: true,
      message: 'Se creó un nuevo usuario.'
    })

  })

})

router.delete('/delete', verifyToken, (request, response) => {
  const { id } = request.user;
  const deleteUserQuery = `call deleteBooksAndUser(${id})`;

  connectDB.query(deleteUserQuery, (error, result) => {
    if (error) {
      response.status(500).json({
        ok: false,
        message: error.message
      })
    }

    response.status(200).json({
      ok: true,
      message: 'Se cambio el estado del usuario en la bd.'
    })
  })
})

module.exports = router;