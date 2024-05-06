// authorMicroservice.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier author.proto
const authorProtoPath = 'author.proto';
const authorProtoDefinition = protoLoader.loadSync(authorProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const authorProto = grpc.loadPackageDefinition(authorProtoDefinition).author;

// Implémenter le service d'auteurs
const authorService = {
  getAuthor: (call, callback) => {
    // Récupérer les détails de l'auteur à partir de la base de données
    const author = {
      id: call.request.author_id,
      name: 'Exemple d\'auteur',
      // Ajouter d'autres champs de données pour l'auteur au besoin
    };
    callback(null, { author });
  },
  searchAuthors: (call, callback) => {
    const { query } = call.request;
    // Effectuer une recherche d'auteurs en fonction de la requête
    const authors = [
      {
        id: '1',
        name: 'Exemple d\'auteur 1',
      },
      {
        id: '2',
        name: 'Exemple d\'auteur 2',
      },
      // Ajouter d'autres résultats de recherche d'auteurs au besoin
    ];
    callback(null, { authors });
  },
  // Ajouter d'autres méthodes au besoin
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(authorProto.AuthorService.service, authorService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Échec de la liaison du serveur:', err);
    return;
  }
  console.log(`Le serveur s'exécute sur le port ${port}`);
  server.start();
});
console.log(`Microservice d'auteurs en cours d'exécution sur le port ${port}`);
