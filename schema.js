const { gql } = require('@apollo/server');

const typeDefs = `
  type Book {
    id: ID!
    title: String!
    authorIds: [ID!]!
    genreId: ID!
    publicationDate: String!
    description: String!
    language: String!
    pageCount: Int!
    availability: Boolean!
  }

  type Author {
    id: ID!
    name: String!
  }

  type Genre {
    id: ID!
    name: String!
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
    authors: [Author]
    author(id: ID!): Author
    genres: [Genre]
    genre(id: ID!): Genre
  }

  type Mutation {
    addBook(
      title: String!
      authorIds: [ID!]!
      genreId: ID!
      publicationDate: String!
      description: String!
      language: String!
      pageCount: Int!
      availability: Boolean!
    ): Book
    updateBook(
      id: ID!
      title: String
      authorIds: [ID]
      genreId: ID
      publicationDate: String
      description: String
      language: String
      pageCount: Int
      availability: Boolean
    ): Book
    deleteBook(id: ID!): Book
    addAuthor(name: String!): Author
    deleteAuthor(id: ID!): Author
    addGenre(name: String!): Genre
    deleteGenre(id: ID!): Genre
  }
`;

module.exports = typeDefs;
