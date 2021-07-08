const { gql } = require("apollo-server");

const typeDefs = gql`
  directive @passer(
    appRoles: [AppRole]! = []
    projRoles: [ProjRole]! = []
  ) on FIELD_DEFINITION

  enum AppRole {
    guest
    member
    admin
  }

  enum ProjRole {
    contributor
  }

  type User {
    id: ID!
    name: String
    role: String
  }

  type Query {
    users: [User] @passer(appRoles: [admin])
  }
`;

module.exports = typeDefs;
