const { gql } = require("apollo-server");

const typeDefs = gql`
  directive @requires(
    userRoles: [UserRole]! = []
    projRoles: [ProjectRole]! = []
  ) on FIELD_DEFINITION

  enum UserRole {
    guest
    member
    admin
  }

  enum ProjectRole {
    contributor
  }

  type User {
    id: ID!
    name: String
    roles: [String]
  }

  type Project {
    id: ID!
    name: String
    status: String
    contract_sum: Int @requires(userRoles: [admin])
  }

  type Indicator {
    id: ID!
    project_id: Int
    name: String
    risk: Int
    quality: Int
  }

  type Query {
    users: [User] @requires(userRoles: [admin])
    project(projectId: ID!): Project
      @requires(userRoles: [admin, member], projRoles: [contributor])
    projects: [Project]
      @requires(userRoles: [admin, member], projRoles: [contributor])
    indicators: [Indicator]
      @requires(userRoles: [admin], projRoles: [contributor])
  }

  type Mutation {
    updateProjectStatus(projectId: ID!, status: String!): Project
      @requires(userRoles: [admin], projRoles: [contributor])
  }
`;

module.exports = typeDefs;
