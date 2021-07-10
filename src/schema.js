const { gql } = require("apollo-server");

const typeDefs = gql`
  directive @requires(
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

  type Project {
    id: ID!
    name: String
    status: String
    contract_sum: Int @requires(appRoles: [admin])
  }

  type Indicator {
    id: ID!
    project_id: Int
    name: String
    risk: Int
    quality: Int
  }

  type Query {
    users: [User] @requires(appRoles: [admin])
    project(projectId: ID!): Project
      @requires(appRoles: [admin, member], projRoles: [contributor])
    projects: [Project]
      @requires(appRoles: [admin, member], projRoles: [contributor])
    indicators: [Indicator]
      @requires(appRoles: [admin], projRoles: [contributor])
  }

  type Mutation {
    updateProjectStatus(projectId: ID!, status: String!): Project
      @requires(appRoles: [admin], projRoles: [contributor])
  }
`;

module.exports = typeDefs;
