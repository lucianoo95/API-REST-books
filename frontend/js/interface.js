import GoogleApi from '../js/GoogleBooks';
const APIbooks = new GoogleApi();

export default class Interface {

  constructor() {
    this.init();
  }

  init() {
    this.printInfo();
    this.copyISBN();
  }

  printInfo() {
    // Seleccionar div del titulo
    const divSection = document.querySelector('#title-favorites');
    divSection.textContent = '';
    //Seleccionar div de las books-cards . 
    const divBooksCards = document.querySelector('#books-cards');
    let deckCards = '';
    APIbooks.getFirstTen()
      .then(data => {
        data.map(book => {
          //Crear cartas de los libros.
          const cardBook = this.createBookCard(book.volumeInfo, 'hidden', '');
          deckCards += cardBook;
        })
        // Imprimir en el html las cartas
        divBooksCards.innerHTML = deckCards;
      })
  }

  // Imprimir resultados de busqueda
  printSearchResult(results, message, attributeDeleteBtn, attributeCopyIsbn) {
    const titleSection = document.querySelector('#title-favorites');
    titleSection.textContent = `${message}`;
    //Seleccionar div de las books-cards . 
    const divBooksCards = document.querySelector('#books-cards');
    this.cleanDiv(divBooksCards);

    let deckCards = '';
    results.map(book => {
      //Crear cartas de los libros.
      const cardBook = this.createBookCard(book.volumeInfo, attributeDeleteBtn, attributeCopyIsbn);
      deckCards += cardBook;
    })
    // Mostrar resultados
    divBooksCards.innerHTML = deckCards;
  }

  //Crear tarjeta para libros
  createBookCard(volumeInfo, attributeDeleteBtn, attributeCopyIsbn) {
    const { title, authors, publisher, averageRating, publishedDate, pageCount, categories, imageLinks, industryIdentifiers, infoLink } = volumeInfo;
    // Imagen de portada por default en caso de que no exista ninguna.
    const imgDefault = 'https://books.google.com.ar/googlebooks/images/no_cover_thumb.gif';
    //Devolver card con info de cada libro 
    return `<div class="card max-size d-inline-block mx-auto m-2 shadow">
              <div class="card-body pt-2 pl-2 pr-2 pb-0 font-italic">
                <div class="text-right">
                <button class="btn btn-secondary btn-sm m-0 border-0 p-1" ${attributeDeleteBtn} data-id="delete-btn" data-isbn="${industryIdentifiers ? industryIdentifiers[0].identifier : ''}"><i class="material-icons md-15">delete</i></button>
                </div>
                <div class="text-center">
                  <img class="card-img w-30 shadow mx-auto" src="${imageLinks ? imageLinks.smallThumbnail : imgDefault}" title="${title}">
                  <h5 class="card-title font-italic mt-3 mb-0"><b>${title}</b></h5>
                  <p class="small mt-0 mb-1">${categories ? categories.map(item => item).join(' , ') : ''}</p>
                  ${this.checkAverage(averageRating)}
                </div>
                <hr class="m-0">
                <ul class="pt-1 pr-3 pb-2 pl-3 m-0 text-secondary">
                  <li><b>Autores</b>: ${authors ? authors.map(item => item).join(' , ') : 'Anonymous'}.</li>
                  <li><b>Páginas</b>: ${pageCount ? pageCount : ' ? '}</li>
                  <li><b>Editor</b>: ${publisher ? publisher : 'Unrecognized'}.</li>
                  <li><b>Fecha</b>: ${publishedDate ? publishedDate : 'Without date'}</li>
                </ul>
                ${industryIdentifiers ?
        `<button class="btn btn-secondary btn-sm ml-1 mr-1 mb-1 text-left font-italic" ${attributeCopyIsbn} data-clipboard-text="${industryIdentifiers[0].identifier}" >Copiar isbn</button>`
        :
        `<button class="btn btn-warning btn-sm ml-1 mr-1 mb-1 text-left font-italic" ${attributeCopyIsbn} title="Este libro no cuenta con ISBN!" disabled>sin isbn</button>`}
                <a href="${infoLink}" target="__blank" class="btn btn-secondary btn-sm float-right mr-1 mb-1">Más info</a>
              </div>
            </div>`;
  }

  // Revisar propiedad 'average' y representar el valor con iconos de 'estrellas'. 
  checkAverage(average) {
    let starsAverage = '';
    // Comprobar que la propiedad 'Average' exista
    if (average) {
      for (let i = 1; i <= average; i++) {
        // Agregar 1 icono de estrella para cada iteracion
        starsAverage += '<i class="material-icons md-15">star</i>';
      }
      // Si es un decimal agregar un icono con media estrella 'stars_half'. 
      Number.isInteger(average) ? '' : starsAverage += '<i class="material-icons md-15">star_half</i>';
    } else {
      // Si no existe 'average' agregar icono de estrella vacia
      starsAverage = '<i class="material-icons md-15">star_border</i>';
    }

    return starsAverage;
  }

  // Mostrar mensaje de exito o error
  showMessage(message, className, nameIcon, divHTML) {
    const inputText = document.querySelector('#text-search');
    const inputISBN = document.querySelector('#isbn-input');
    // comprobar si hay un error ; borrar el valor del input y seleccionar el mismo
    if (divHTML === 'message') {
      inputText.value = '';
      inputText.focus();
    } else {
      inputISBN.value = '';
      inputISBN.focus();
    }
    // Seleccionar div del mensaje
    const divMessage = document.querySelector(`#${divHTML}`);
    // Limpiar div
    this.cleanDiv(divMessage);
    // Crear mensaje de alerta
    const alert = `<div class="alert ${className} shadow text-center" role="alert">
                  <i class="material-icons md-17 ml-0 mr-1">${nameIcon}</i>
                  ${message}.            
                  </div>`;
    // Insertar mensaje dentro del div
    divMessage.innerHTML += alert;
    // eliminar el mensaje despues de 2 segundos
    setTimeout(() => {
      this.cleanDiv(divMessage);
    }, 3000);
  }

  // Mostrar mensaje en el modal de login o register
  messageModal(message, className, nameIcon, idDiv) {
    // Seleccionar div del mensaje
    const divMessage = document.querySelector(`#message-${idDiv}`);
    // Limpiar div
    this.cleanDiv(divMessage);
    // Crear mensaje de alerta
    const alert = `<div class="alert ${className} text-center" role="alert">
                      <h5><i class="material-icons md-17 mt-1 mb-1">${nameIcon}</i>
                        ${message}.</h5>              
                      </div>`;
    // Insertar mensaje dentro del div
    divMessage.innerHTML += alert;
    // eliminar el mensaje despues de 2 segundos
    setTimeout(() => {
      this.cleanDiv(divMessage);
    }, 2500);
  }

  // Ocultar modal
  closeModal(idModal) {

    setTimeout(() => {
      // seleccionar modal
      const modal = document.querySelector(`#modal-${idModal}`);
      // Ocultar modal despues de mostrar mensajes 
      modal.style.display = 'none';
      modal.className = 'modal fade';
      document.querySelector('.modal-backdrop.fade.show').remove();
      document.querySelector('.modal-open').removeAttribute('style');
      document.querySelector('.modal-open').removeAttribute('class');
    }, 2500);

  }

  // Mostrar modal
  openModal(idModal) {

    setTimeout(() => {
      // seleccionar modal
      const modal = document.querySelector(`#modal-${idModal}`);
      // Ocultar modal despues de mostrar mensajes 
      modal.style.display = 'block';
      modal.className = 'modal fade show';
      const body = document.querySelector('#body');
      const divBackgroundModal = '<div class="modal-backdrop fade show"></div>';
      body.insertAdjacentHTML('beforeend', divBackgroundModal);
      body.className = 'modal-open';
      body.style.paddingRight = '17px';
    }, 3000);


  }

  // Modificar navegacion del navbar
  modifyNavbar(username) {
    //Seleccionar navbar
    const navbarBtns = document.querySelector('#navbar-btns');
    // Limpiar navbarBtns 
    this.cleanDiv(navbarBtns);
    // Crear nueva navegacion
    const navBtn = `<li>
                    <div class="btn-group dropleft">
                      <button type="button" class="btn btn-primary dropdown-toggle pt-1 pb-1" data-toggle="dropdown">
                        ${username}
                      </button>
                      <div class="dropdown-menu shadow">
                        <button class="dropdown-item" type="button" id="fav-btn">
                        <i class="material-icons md-15 mr-1">favorite</i>Favoritos
                        </button>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item" type="button" id="logout-btn">
                        <i class="material-icons md-15 mr-1">exit_to_app</i>Cerrar sesión
                        </button>
                      </div>
                    </div>
                    </li>`;
    // Mostrar nueva navegacion.
    navbarBtns.innerHTML = navBtn;
  }

  // eliminar carta del libro
  removeCard(isbn) {
    const card = document.querySelector(`button[data-isbn="${isbn}"]`);
    card.parentElement.parentElement.parentElement.remove();
  }

  // Limpiar divs
  cleanDiv(elementHTML) {
    // Forma rapida
    while (elementHTML.firstChild) elementHTML.firstChild.remove();
  }

  // Limpiar formulario
  cleanForm(form) {
    document.querySelector(`#${form}`).reset();
  }

  // metodo para copiar el isbn de un libro
  copyISBN() {
    // copiar ISBN en el Clipboard.
    const clipboard = new ClipboardJS('.btn');
    // Si tiene exito guardar el valor en un una variable
    clipboard.on('success', (e) => {
      const isbnBook = e.text;
      const btnHtml = e.trigger;
      btnHtml.classList.remove('btn-secondary');
      btnHtml.classList.add('btn-success');
      btnHtml.textContent = 'isbn copiado';

      setTimeout(() => {
        btnHtml.classList.remove('btn-success');
        btnHtml.classList.add('btn-secondary');
        btnHtml.textContent = 'copiar isbn';
      }, 4000);

      console.log('ISBN : ', isbnBook);
    });
    // Si falla mostrar el error
    clipboard.on('error', (e) => console.log('No funciona: ', e));
  }

  //Pegar ISBN del libro en el input del formulario
  async pasteISBN() {
    // Seleccionar el input que almacena el isbn
    const isbnInput = document.querySelector('#isbn-input');
    // Solicitar al nevagador permiso para leer el clipboard
    const isbnValue = await navigator.clipboard.readText();
    // seleccionar clipboard e insertar valor del clipboard. 
    isbnInput.select();
    isbnInput.value = isbnValue;
  }

  // Cerrar sesion
  signOff() {
    // Eliminar token
    localStorage.removeItem('token');
    location.reload();
  }

}