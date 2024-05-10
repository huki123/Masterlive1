const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

// Load the Book protobuf definition
const bookProtoPath = 'book.proto';
const bookProtoDefinition = protoLoader.loadSync(bookProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const bookProto = grpc.loadPackageDefinition(bookProtoDefinition).book;

// Implement the getAllBooks method
function getAllBooks(call, callback) {
    // Your implementation here to fetch all books from your data source
    // For example:
    const books = [
        { id: '1', title: 'Book 1', authors: ['Author 1'], genre: 'Fiction' },
        { id: '2', title: 'Book 2', authors: ['Author 2'], genre: 'Non-Fiction' },
        // Add more books as needed
    ];
    callback(null, { books: books });
}

// Implement the book service
const bookService = {
    getBook: (call, callback) => {
        // Retrieve book details from the database
        const book = {
            id: call.request.book_id,
            title: 'Exemple de livre',
            author: 'Auteur Exemple',
            genre: 'Genre Exemple',
            publicationDate: '2024-05-07',
            description: 'Ceci est un exemple de livre.',
            language: 'Français',
            pages: 200,
            availability: true, 
            // Add other book data fields as needed
        };
        callback(null, { book });
    },
    searchBooks: (call, callback) => {
        const { query } = call.request;
        // Perform book search based on the query
        const books = [
            {
                id: '1',
                title: 'Exemple de livre 1',
                author: 'Auteur Exemple 1',
                genre: 'Genre Exemple 1',
                publicationDate: '2024-05-07',
                description: 'Ceci est le premier exemple de livre.',
                language: 'Français',
                pageCount: 300,
                availability: true, 
            },
            {
                id: '2',
                title: 'Exemple de livre 2',
                author: 'Auteur Exemple 2',
                genre: 'Genre Exemple 2',
                publicationDate: '2024-05-07',
                description: 'Ceci est le deuxième exemple de livre.',
                language: 'Anglais',
                pageCount: 250,
                availability: true,
            },
            // Add other book search results as needed
        ];
        callback(null, { books });
    },
    getAllBooks: getAllBooks, // Add the getAllBooks method here
    // Add other methods as needed
};

// Create and start the gRPC server
const server = new grpc.Server();
server.addService(bookProto.BookService.service, bookService);
const port = 50051; // Choose your preferred port
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind server:', err);
        return;
    }
    console.log(`Server is running on port ${port}`);
    server.start();
});

console.log(`Book microservice is running on port ${port}`);
