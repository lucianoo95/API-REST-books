export default class API {

  constructor() {
    this.url = 'http://localhost:4000/api/';
  }

  // Obtener token de Autenticacion en caso de estar registrado
  async getAuthentication(data) {
    // Configurar metodo post y datos a enviar
    const configuration = {
      method: 'POST',
      body: data
    };
    const response = await fetch(`${this.url}users/login`, configuration);
    const result = await response.json();
    return result;
  }

  // Crear nuevo usuario
  async createUser(data) {
    //Configurar metodo post y datos a enviar
    const configuration = {
      method: 'POST',
      body: data
    };
    const response = await fetch(`${this.url}users/create`, configuration);
    const result = await response.json();
    return result;
  }

  // Listar libros
  async getCollectionBooks() {
    // configurar headers y enviar token en las cabeceras
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      method: 'GET'
    };
    const response = await fetch(`${this.url}books/`, config);
    const collection = await response.json();
    return collection;
  }

  // Guardar libro en la collection del usuario
  async saveBook(isbn) {
    // Configurar metodo post ,datos a enviar y headers con Authorization token. 
    const configuration = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      method: 'POST',
      body: isbn
    };
    const response = await fetch(`${this.url}books/add`, configuration);
    const result = await response.json();
    return result;
  }

  // Eliminar libro
  async deleteBook(isbn) {
    // Configurar metodo delete, datos y headers
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      method: 'DELETE'
    };
    const response = await fetch(`${this.url}books/delete/${isbn}`, config);
    const result = await response.json();
    return result;
  }

}