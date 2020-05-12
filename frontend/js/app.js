// Importar css
import '../styles/bootstrap.css';
import '../styles/style.css';
// Importar clases
import Interface from '../js/interface';
import GoogleApi from './GoogleBooks';
import API from './API';
// Instanciar clases
const ui = new Interface();
const googleBooks = new GoogleApi();
const apiBackend = new API();

// seleccionar botones
const searchBtn = document.querySelector('#search-btn');
const loginBtn = document.querySelector('#btn-login');
const registerBtn = document.querySelector('#btn-register');
const pasteIsbnBtn = document.querySelector('#isbn-paste-btn');
const saveBookBtn = document.querySelector('#save-btn');
// variables que 
let favouritesBtn, logoutBtn, deleteBook;

// Funciones
// Agregar nuevos listenners para los nuevos botones 
const addListenners = () => {
  //Boton dentro del dropdown del usuario que lista los favoritos del usuario
  favouritesBtn = document.querySelector('#fav-btn').addEventListener('click', () => {
    // guardar coleccion en un array
    let books = [];
    // Listar favoritos
    apiBackend.getCollectionBooks()
      .then(async data => {
        // Si la lista esta vacia que muestre un mensaje
        if (data.length === 0) {
          document.querySelector('#title-favorites').textContent = 'Aún no hay libros guardados';
          const divBooks = document.querySelector('#books-cards');
          ui.cleanDiv(divBooks);
        } else {
          // obtener libro mediante isbn
          for (let book of data) {
            const bookInfo = await googleBooks.getVolume('isbn:', book.isbn);
            // guardar books en el array
            books.push(bookInfo[0]);
          }
          // mostrar resultados
          ui.printSearchResult(books, 'Mis favoritos', '', 'hidden');
          // Codigo inexplicable
          // Agregar un listener para cada boton de 'eliminar libro', codigo rancio
          const btnsDelete = Array.from(document.querySelectorAll('[data-id="delete-btn"]'));
          // recorrer array de botones
          btnsDelete.map(element => {
            element.addEventListener('click', () => {
              // seleccionar isbn del libro
              const isbn = element.dataset.isbn;
              // eliminar carta del html
              ui.removeCard(isbn);
              // eliminar libro de la coleccion del usuario
              apiBackend.deleteBook(isbn)
                .then(data => {
                  ui.showMessage(`${data.message}`, 'alert-warning', 'feedback', 'message-save-book');
                })
                .catch(error => {
                  throw error;
                })
            })
          })

        }

      })
      .catch(error => {
        throw error;
      })
  })

  // Btn para cerrar sesion
  logoutBtn = document.querySelector('#logout-btn').addEventListener('click', () => {
    // Cerrar sesion
    ui.signOff();
  })

}

//Listenners
searchBtn.addEventListener('click', (e) => {
  // Detener el evento submit
  e.preventDefault();
  // seleccionar valor del select
  const selectType = document.querySelector('#select-type-of-search');
  const typeSelected = selectType.options[selectType.selectedIndex].value;
  // seleccionar valor del input
  const inputText = document.querySelector('#text-search').value;
  // validar formulario
  if (typeSelected === '0' || inputText === '') {
    // Formulario incompleto: lanzar mensaje de error
    ui.showMessage('Debes completar todos los campos', 'alert-danger', 'warning', 'message');
  } else {
    // form completo: mostrar mensaje de exito
    ui.showMessage('Obteniendo resultados...', 'alert-info', 'check_circle', 'message')
    // Obtener resultados y mostrarlos
    googleBooks.getVolume(typeSelected, inputText)
      .then(data => {
        if (!data) {
          ui.showMessage('No se encontraron resultados.', 'alert-danger', 'sentiment_very_dissatisfied', 'message');
        } else {
          ui.printSearchResult(data, 'Resultados de la búsqueda..', 'hidden', '');
        }
      })
      .catch(error => {
        throw error;
      })
  }

})

loginBtn.addEventListener('click', (e) => {
  // detener el evento
  e.preventDefault();

  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  if (username === '' || password === '') {
    ui.messageModal('Debes completar los campos.', 'alert-danger', 'error', 'login');
  } else {
    // Mostrar mensaje para 'simular' inicio de sesion
    ui.messageModal('Ingresando...', 'alert-primary', 'account_circle', 'login');

    const data = new FormData(document.querySelector('#login-form'));
    // Obtener token de autenticacion del backend 
    apiBackend.getAuthentication(data)
      .then(result => {
        const { message, token } = result;
        // Mostrar mensaje de Bienvenido al usuario logeado
        ui.messageModal(`${message}`, 'alert-success', 'verified_user', 'login');
        // Limpiar formulario
        ui.cleanForm('login-form');
        // Almacenar token en el localStorage
        localStorage.setItem('token', token);
        // Modificar navegacion del navbar
        ui.modifyNavbar(username);
        // Habilitar boton para guardar nuevos libros
        saveBookBtn.removeAttribute('disabled');
        // Ocultar modal
        ui.closeModal('login');

        addListenners();
      })
      .catch(error => {
        throw error;
      })

  }
})

registerBtn.addEventListener('click', (e) => {
  // Detener evento
  e.preventDefault();
  // Seleccionar campos del form register
  const username = document.querySelector('#new_username').value;
  const email = document.querySelector('#new_email').value;
  const password = document.querySelector('#new_password').value;
  // Comprobar que los campos no esten vacios
  if (username === '' || email === '' || password === '') {
    ui.messageModal('Debes completar los campos.', 'alert-danger', 'error', 'register');
  } else {
    // Mostrar mensaje para 'simular' inicio de sesion
    ui.messageModal('Creando nuevo usuario', 'alert-info', 'account_circle', 'register');
    // Seleccionar datos dl formulario
    const data = new FormData(document.querySelector('#register-form'));
    // Crear usuario y almacenarlo en la BD
    apiBackend.createUser(data)
      .then(data => {
        // Mostrar mensaje de exito
        ui.messageModal(`${data.message}`, 'alert-success', 'done', 'register');
        // Limpiar form
        ui.cleanForm('register-form');
        // Cerrar modal
        ui.closeModal('register')
        // Abrir modal para inicar sesion con el nuevo usuario
        ui.openModal('login');
      });
  }

})

pasteIsbnBtn.addEventListener('click', () => ui.pasteISBN());

saveBookBtn.addEventListener('click', (e) => {
  // detener envio del furmulario
  e.preventDefault();
  // seleccionar isbn del libro
  const isbn = document.querySelector('#isbn-input').value;
  // Comprobar que el isbn inpit no este vacio 
  if (isbn === '') {
    // Mostrar mensaje de error
    ui.showMessage('Debes ingresar el ISBN del libro a guardar', 'alert-danger', 'error', 'message-save-book');
  } else {
    const data = new FormData(document.querySelector('#save-book-form'));
    // Guardar libro
    apiBackend.saveBook(data)
      .then(data => {
        ui.showMessage(`${data.message}`, 'alert-success', 'done', 'message-save-book');
        ui.cleanForm('save-book-form');
      })
  }

})


