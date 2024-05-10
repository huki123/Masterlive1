// bookModel.js

const mongoose = require('mongoose');

// Définition du schéma pour les livres
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  pageCount: { type: Number, required: true },
  availability: { type: Boolean, required: true }
});

// Création du modèle de livre à partir du schéma
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
