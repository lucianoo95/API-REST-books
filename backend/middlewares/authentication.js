const jwt = require('jsonwebtoken');

//Verificar token con jsonwebtoken
const verifyToken = (request, response, next) => {

  //Obtener el token de los headers.
  let token = request.get('Authorization');

  //Comprobar que el token sea valido
  if (token) {
    //Eliminar bearer del token. 
    token = token.slice(7, token.length);

    jwt.verify(token, process.env.SEED, (error, decoded) => {
      if (error) {
        response.status(400).json({
          ok: false,
          message: `Token no valido. ${error.message}`
        }); 
      }

      //Agrego en los headers , la informacion del token
      request.user = decoded.user;
      next();
    })
  }
}

module.exports = { verifyToken }