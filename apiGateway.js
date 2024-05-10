const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Import your resolver functions
const resolvers = require('./resolvers');
const { connectDB, Author, Book, Genre } = require('./dbConfig');

const app = express();
const port = 3000;

app.use(bodyParser.json());


// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
    // Additional code that depends on the database connection
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


// Placeholder arrays to simulate data storage
let books = [];
let authors = [];
let genres = [];

/******************************************************
 * REST API Routes
 ******************************************************/
// Create a new book
app.post('/books', async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.json(newBook);
  } catch (err) {
    res.status(500).send(err);
  }
});


// Create a new author
app.post('/authors', async (req, res) => {
  try {
    const newAuthor = await Author.create(req.body);
    res.json(newAuthor);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new genre
app.post('/genres', async (req, res) => {
  try {
    const newGenre = await Genre.create(req.body);
    res.json(newGenre);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete an author by ID
app.delete('/authors/:id', async (req, res) => {
  try {
    await Author.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a genre by ID
app.delete('/genres/:id', async (req, res) => {
  try {
    await Genre.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update an author by ID
app.put('/authors/:id', async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAuthor);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a genre by ID
app.put('/genres/:id', async (req, res) => {
  try {
    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGenre);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Récupération de tous les livres
app.get('/books', async (req, res) => {
  try {
    const allBooks = await Book.find();
    res.json(allBooks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Récupération d'un livre par ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).send('Book not found');
    } else {
      res.json(book);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Récupération de tous les auteurs
app.get('/authors', async (req, res) => {
  try {
    const allAuthors = await Author.find();
    res.json(allAuthors);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Récupération d'un auteur par ID
app.get('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      res.status(404).send('Author not found');
    } else {
      res.json(author);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Récupération de tous les genres
app.get('/genres', async (req, res) => {
  try {
    const allGenres = await Genre.find();
    res.json(allGenres);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Récupération d'un genre par ID
app.get('/genres/:id', async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      res.status(404).send('Genre not found');
    } else {
      res.json(genre);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

/******************************************************
 * Apollo Server Configuration
 ******************************************************/

// Load schema file
const schemaFile = fs.readFileSync('schema.gql', 'utf-8');

// Define your Apollo Server with typeDefs from schema file
const server = new ApolloServer({ typeDefs: gql(schemaFile), resolvers });

// Start the server and apply middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer().then(() => {
  // Load proto files for microservices
  const bookProtoPath = 'book.proto';
  const authorProtoPath = 'author.proto';
  const genreProtoPath = 'genre.proto';

  const bookProtoDefinition = protoLoader.loadSync(bookProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const authorProtoDefinition = protoLoader.loadSync(authorProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const genreProtoDefinition = protoLoader.loadSync(genreProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const bookProto = grpc.loadPackageDefinition(bookProtoDefinition).book;
  const authorProto = grpc.loadPackageDefinition(authorProtoDefinition).author;
  const genreProto = grpc.loadPackageDefinition(genreProtoDefinition).genre;

  const bookServiceClient = new bookProto.BookService('localhost:50051', grpc.credentials.createInsecure());
  const authorServiceClient = new authorProto.AuthorService('localhost:50052', grpc.credentials.createInsecure());
  const genreServiceClient = new genreProto.GenreService('localhost:50053', grpc.credentials.createInsecure());

  // Start the server
  app.listen(port, () => {
    console.log(`API Gateway running at http://localhost:${port}`);
  });
});
