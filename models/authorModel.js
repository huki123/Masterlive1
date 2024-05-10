const mongoose = require('mongoose');

// Définition du schéma pour l'auteur
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// Création du modèle Author à partir du schéma
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
