const { ForbiddenError } = require("apollo-server");
const User = require("./models/user");
const Project = require("./models/project");

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      // clone context user as it may be overwritten
      const user = User.clone(context.user);
      if (await context.oso.isAllowed(user, "list:users", "_")) {
        const results = await User.fetchUsers();
        console.log(results);
        return results;
      } else {
        throw new ForbiddenError(
          JSON.stringify({ requires: user.requires, groups: user.groups })
        );
      }
    },
    project: async (_, args, context) => {
      // clone context user as it may be overwritten
      const user = User.clone(context.user);
      const result = await Project.fetchProjects([args.projectId]);
      if (await context.oso.isAllowed(user, "get:project", result[0])) {
        return result[0];
      } else {
        throw new ForbiddenError(
          JSON.stringify({ requires: user.requires, groups: user.groups })
        );
      }
    },
    projects: async (_, __, context) => {
      // clone context user as it may be overwritten
      const user = User.clone(context.user);
      const results = await Project.fetchProjects();
      const authorizedResults = [];
      for (const result of results) {
        if (await context.oso.isAllowed(user, "get:project", result)) {
          authorizedResults.push(result);
        }
      }
      return authorizedResults;
    },
    indicators: async (_, __, context) => {
      return [];
    },
  },
  Mutation: {
    updateProjectStatus: async (_, args, context) => {
      return {};
    },
  },
};

module.exports = resolvers;
