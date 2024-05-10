const mongoose = require('mongoose');

// Définition du schéma pour le genre
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// Création du modèle Genre à partir du schéma
const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
