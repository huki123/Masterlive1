const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier book.proto
const bookProtoPath = 'book.proto';
const bookProtoDefinition = protoLoader.loadSync(bookProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const bookProto = grpc.loadPackageDefinition(bookProtoDefinition).book;

// Implémenter le service book
const bookService = {
    getBook: (call, callback) => {
        // Récupérer les détails du livre à partir de la base de données
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
            // Ajouter d'autres champs de données pour le livre au besoin
        };
        callback(null, { book });
    },
    searchBooks: (call, callback) => {
        const { query } = call.request;
        // Effectuer une recherche de livres en fonction de la requête
        const books = [
            {
                id: '1',
                title: 'Exemple de livre 1',
                author: 'Auteur Exemple 1',
                genre: 'Genre Exemple 1',
                publicationDate: '2024-05-07',
                description: 'Ceci est le premier exemple de livre.',
                language: 'Français',
                pages: 300,
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
                pages: 250,
                availability: true,
            },
            // Ajouter d'autres résultats de recherche de livres au besoin
        ];
        callback(null, { books });
    },
    // Ajouter d'autres méthodes au besoin
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(bookProto.BookService.service, bookService);
const port = 50052; // Choisir le port que vous préférez
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
(err, port) => {
    if (err) {
        console.error('Échec de la liaison du serveur:', err);
        return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
});

console.log(`Microservice de livres en cours d'exécution sur le port ${port}`);
