const { ForbiddenError } = require("apollo-server");
const User = require("./models/user");
const Project = require("./models/project");

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      if (await context.oso.isAllowed(context.user, "list:users", "_")) {
        return await User.fetchUsers();
      } else {
        throw new ForbiddenError("Not allowed");
      }
    },
    project: async (_, args, context) => {
      context.user.requires.userProjects = await Project.fetchUserProjectRoles(
        context.user.id,
        [args.projectId]
      );

      const result = await Project.fetchProjects([args.projectId]);
      if (await context.oso.isAllowed(context.user, "get:project", result)) {
        return result[0];
      } else {
        throw new ForbiddenError("Not allowed");
      }
    },
    projects: async (_, __, context) => {
      context.user.requires.userProjects = await Project.fetchUserProjectRoles(
        context.user.id
      );
      const results = await Project.fetchProjects();
      const authorizedResults = [];
      for (const result of results) {
        if (await context.oso.isAllowed(context.user, "get:project", result)) {
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
