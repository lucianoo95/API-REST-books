const connectDB = require('../connectionDB');
const { verifyToken } = require('../middlewares/authentication');
const { Router } = require('express');
const router = Router();

//Listar todos los libros del usuario
router.get('/', verifyToken, (request, response) => {
  const user = request.user.id;
  const getBookQuery = `select books.*, favorites.date
                        from favorites 
                        inner join books on (favorites.book = books.isbn)
                        inner join users on (favorites.user = users.id) 
                        where favorites.user=${user} and users.state = 1`;

  connectDB.query(getBookQuery, (error, result) => {
    if (error) {
      response.status(500).json({
        ok: false,
        message: error.message
      })
    }

    response.status(200).json(result);
  });

})

// Agregar un libro a la lista del usuario
router.post('/add', verifyToken, (request, response) => {
  const { isbn } = request.body;
  const user = request.user.id;
  const addBookQuery = `call verifyAndInsertBooks(${isbn},${user},'${new Date().getTime()}')`;

  connectDB.query(addBookQuery, (error, result) => {
    if (error) {
      response.status(500).json({
        ok: false,
        message: error.message
      })
    }

    response.status(201).json({
      ok: true,
      message: 'Se guardo un nuevo libro.'
    })
  })

})

//Eliminar un libro de la lista del usuario
router.delete('/delete/:isbn', verifyToken, (request, response) => {
  const { isbn } = request.params;
  const user = request.user.id;
  const deleteBookQuery = `delete from favorites where favorites.book=${isbn} and favorites.user=${user}`;

  connectDB.query(deleteBookQuery, (error, result) => {
    if (error) {
      response.status(500).json({
        ok: false,
        message: error.message
      })
    }

    response.status(200).json({
      ok: true,
      message: 'Se elimino el libro correctamente.'
    })
  })

})

module.exports = router;