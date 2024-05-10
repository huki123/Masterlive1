// dbConfig.js

const mongoose = require('mongoose');

// Importing models
const Author = require('./models/authorModel');
const Book = require('./models/bookModel');
const Genre = require('./models/genreModel');

const connectDB = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect('mongodb://localhost:27017/biblio', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the application on connection error
  }
};

module.exports = { connectDB, Author, Book, Genre };
