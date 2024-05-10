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
app.post('/books', (req, res) => {
    const newBook = req.body;
    books.push(newBook);
    res.json(newBook);
});

// Create a new author
app.post('/authors', (req, res) => {
    const newAuthor = req.body;
    authors.push(newAuthor);
    res.json(newAuthor);
});

// Create a new genre
app.post('/genres', (req, res) => {
    const newGenre = req.body;
    genres.push(newGenre);
    res.json(newGenre);
});

// Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  const index = books.findIndex(book => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    res.status(204).send(); // Renvoyer une réponse 204 No Content pour indiquer que la suppression a réussi
  } else {
    res.status(404).send('Book not found');
  }
});

// Delete an author by ID
app.delete('/authors/:id', (req, res) => {
  const id = req.params.id;
  const index = authors.findIndex(author => author.id === id);
  if (index !== -1) {
    authors.splice(index, 1);
    res.status(204).send(); // Renvoyer une réponse 204 No Content pour indiquer que la suppression a réussi
  } else {
    res.status(404).send('Author not found');
  }
});

// Delete a genre by ID
app.delete('/genres/:id', (req, res) => {
  const id = req.params.id;
  const index = genres.findIndex(genre => genre.id === id);
  if (index !== -1) {
    genres.splice(index, 1);
    res.status(204).send(); // Renvoyer une réponse 204 No Content pour indiquer que la suppression a réussi
  } else {
    res.status(404).send('Genre not found');
  }
});

// Update a book by ID
app.put('/books/:id', (req, res) => {
  const id = req.params.id;
  const index = books.findIndex(book => book.id === id);
  if (index !== -1) {
    const updatedBook = req.body;
    books[index] = { ...books[index], ...updatedBook };
    res.json(books[index]);
  } else {
    res.status(404).send('Book not found');
  }
});

// Update an author by ID
app.put('/authors/:id', (req, res) => {
  const id = req.params.id;
  const index = authors.findIndex(author => author.id === id);
  if (index !== -1) {
    const updatedAuthor = req.body;
    authors[index] = { ...authors[index], ...updatedAuthor };
    res.json(authors[index]);
  } else {
    res.status(404).send('Author not found');
  }
});

// Update a genre by ID
app.put('/genres/:id', (req, res) => {
  const id = req.params.id;
  const index = genres.findIndex(genre => genre.id === id);
  if (index !== -1) {
    const updatedGenre = req.body;
    genres[index] = { ...genres[index], ...updatedGenre };
    res.json(genres[index]);
  } else {
    res.status(404).send('Genre not found');
  }
});

// Récupération de tous les livres
app.get('/books', (req, res) => {
  bookServiceClient.searchBooks({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.books);
    }
  });
});

// Récupération d'un livre par ID
app.get('/books/:id', (req, res) => {
  const id = req.params.id;
  bookServiceClient.getBook({ bookId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.book);
    }
  });
});

// Récupération de tous les auteurs
app.get('/authors', (req, res) => {
  authorServiceClient.searchAuthors({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.authors);
    }
  });
});

// Récupération d'un auteur par ID
app.get('/authors/:id', (req, res) => {
  const id = req.params.id;
  authorServiceClient.getAuthor({ authorId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.author);
    }
  });
});

// Récupération de tous les genres
app.get('/genres', (req, res) => {
  genreServiceClient.searchGenres({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.genres);
    }
  });
});

// Récupération d'un genre par ID
app.get('/genres/:id', (req, res) => {
  const id = req.params.id;
  genreServiceClient.getGenre({ genreId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.genre);
    }
  });
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
