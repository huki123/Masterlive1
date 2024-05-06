const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier genre.proto
const genreProtoPath = 'genre.proto';
const genreProtoDefinition = protoLoader.loadSync(genreProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const genreProto = grpc.loadPackageDefinition(genreProtoDefinition).genre;

// Implémenter le service de genre
const genreService = {
    getGenre: (call, callback) => {
        // Récupérer les détails du genre à partir de la base de données
        const genre = {
            id: call.request.genre_id,
            name: 'Exemple de genre',
            // Ajouter d'autres champs de données pour le genre au besoin
        };
        callback(null, { genre });
    },
    searchGenres: (call, callback) => {
        const { query } = call.request;
        // Effectuer une recherche de genres en fonction de la requête
        const genres = [
            {
                id: '1',
                name: 'Exemple de genre 1',
            },
            {
                id: '2',
                name: 'Exemple de genre 2',
            },
            // Ajouter d'autres résultats de recherche de genres au besoin
        ];
        callback(null, { genres });
    },
    // Ajouter d'autres méthodes au besoin
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(genreProto.GenreService.service, genreService);
const port = 50053; // Choisir le port que vous préférez
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
(err, port) => {
    if (err) {
        console.error('Échec de la liaison du serveur:', err);
        return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
});

console.log(`Microservice de genres en cours d'exécution sur le port ${port}`);
