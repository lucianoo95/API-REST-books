export default class GoogleApi {

  constructor() {
    this.url = 'https://www.googleapis.com/books/v1/volumes?q=';
  }

  async getFirstTen() {
    //Obtener libros para la pagina principal.
    const books = await fetch(`${this.url}subject:drama`);
    const results = await books.json();
    return results.items;
  }

  async getVolume(typeParameter, title) {
    // Obtener un libro especifico
    const books = await fetch(`${this.url + typeParameter + title}`);
    const results = await books.json();
    return results.items;
  }

}