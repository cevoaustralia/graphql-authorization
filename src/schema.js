const { gql } = require("apollo-server");

const typeDefs = gql`
  directive @auth(
    userGroups: [UserGroup]
    projGroups: [ProjectGroup]
  ) on OBJECT | FIELD_DEFINITION

  enum UserGroup {
    guest
    member
    admin
  }

  enum ProjectGroup {
    contributor
  }

  type User {
    id: ID!
    name: String
    groups: [String]
  }

  type Project {
    id: ID!
    name: String
    status: String
    contract_sum: Int @auth(userGroups: [admin], projGroups: [contributor])
  }

  type Indicator {
    id: ID!
    project_id: Int
    risk: Int
    quality: Int
  }

  type Query {
    users: [User] @auth(userGroups: [admin])
    project(projectId: ID!): Project
      @auth(userGroups: [admin, member], projGroups: [contributor])
    projects: [Project]
      @auth(userGroups: [admin, member], projGroups: [contributor])
    indicators: [Indicator]
      @auth(userGroups: [admin], projGroups: [contributor])
  }

  type Mutation {
    updateProjectStatus(projectId: ID!, status: String!): Project
      @auth(userGroups: [admin], projGroups: [contributor])
  }
`;

module.exports = typeDefs;
