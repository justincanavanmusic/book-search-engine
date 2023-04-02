const { gql } = require('apollo-server-express');

const typeDefs = gql `
type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Integer
    savedBooks: [Book]
}

type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String   
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
}

input BookData {
    authors: [String], description: String!, title: String!, bookId: String!, image: String
}

type Mutation {

    loginUser(email: String!, password: String!): Auth

    addUser(username: String!, email: String!, password: String!): Auth

    saveBook(bookData: BookData!): User

    removeBook(bookId: String!): User
}
`


module.exports = typeDefs;