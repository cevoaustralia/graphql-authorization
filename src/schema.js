const { gql } = require("apollo-server");

const typeDefs = gql`
  directive @auth(
    userRoles: [UserRole]
    projRoles: [ProjectRole]
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
    contract_sum: Int @auth(userRoles: [admin], projRoles: [contributor])
  }

  type Indicator {
    id: ID!
    project_id: Int
    name: String
    risk: Int
    quality: Int
  }

  type Query {
    users: [User] @auth(userRoles: [admin])
    project(projectId: ID!): Project
      @auth(userRoles: [admin, member], projRoles: [contributor])
    projects: [Project]
      @auth(userRoles: [admin, member], projRoles: [contributor])
    indicators: [Indicator] @auth(userRoles: [admin], projRoles: [contributor])
  }

  type Mutation {
    updateProjectStatus(projectId: ID!, status: String!): Project
      @auth(userRoles: [admin], projRoles: [contributor])
  }
`;

module.exports = typeDefs;
