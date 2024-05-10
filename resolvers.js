const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load protocol definitions for book, author, and genre microservices
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

const resolvers = {
  Query: {
    // Resolver to get a book by ID
    book: (_, { id }) => {
      const client = new bookProto.BookService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getBook({ bookId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.book);
          }
        });
      });
    },

    // Resolver to get all books
    books: () => {
      const bookClient = new bookProto.BookService('localhost:50051', grpc.credentials.createInsecure());
      const authorClient = new authorProto.AuthorService('localhost:50052', grpc.credentials.createInsecure());
      const genreClient = new genreProto.GenreService('localhost:50053', grpc.credentials.createInsecure());
      
      return new Promise((resolve, reject) => {
        bookClient.getAllBooks({}, (bookErr, bookResponse) => {
          if (bookErr) {
            reject(bookErr);
          } else {
            const books = bookResponse.books.map(book => {
              return new Promise((bookResolve, bookReject) => {
                const authorIds = book.authors.map(authorId => authorId);
                const genreId = book.genreId;
                const genrePromise = new Promise((genreResolve, genreReject) => {
                  genreClient.getGenre({ genreId }, (genreErr, genreResponse) => {
                    if (genreErr) {
                      genreReject(genreErr);
                    } else {
                      genreResolve(genreResponse.genre);
                    }
                  });
                });
    
                const authorsPromises = authorIds.map(authorId => {
                  return new Promise((authorResolve, authorReject) => {
                    authorClient.getAuthor({ authorId }, (authorErr, authorResponse) => {
                      if (authorErr) {
                        authorReject(authorErr);
                      } else {
                        authorResolve(authorResponse.author);
                      }
                    });
                  });
                });

                // Handle null publicationDateu
                const publicationDate = book.publicationDate || "Unknown";
                // Handle null pageCount
                const pageCount = book.pageCount !== null ? book.pageCount : 0;

                Promise.all([genrePromise, ...authorsPromises])
                  .then(([genre, ...authors]) => {
                    bookResolve({
                      ...book,
                      genreId: genre.id,
                      authorIds: authors.map(author => author.id),
                      publicationDate: publicationDate,
                      pageCount: pageCount,
                    });
                  })
                  .catch(bookReject);
              });
            });
    
            Promise.all(books)
              .then(resolve)
              .catch(reject);
          }
        });
      });
    },

    // Resolver to get an author by ID
    author: (_, { id }) => {
      const client = new authorProto.AuthorService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getAuthor({ authorId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.author);
          }
        });
      });
    },

    // Resolver to get all authors
    authors: () => {
      const client = new authorProto.AuthorService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getAllAuthors({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.authors);
          }
        });
      });
    },

    // Resolver to get a genre by ID
    genre: (_, { id }) => {
      const client = new genreProto.GenreService('localhost:50053', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getGenre({ genreId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.genre);
          }
        });
      });
    },

    // Resolver to get all genres
    genres: () => {
      const client = new genreProto.GenreService('localhost:50053', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getAllGenres({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.genres);
          }
        });
      });
    },
  },
};

module.exports = resolvers;
