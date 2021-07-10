const { ForbiddenError } = require("apollo-server");
const { initOso } = require("./polars/loads");
const User = require("./models/user");
const Project = require("./models/project");

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      const oso = await initOso();

      if (await oso.isAllowed(context.user, "list:users", "_")) {
        return await User.fetchUsers();
      } else {
        throw new ForbiddenError("Not allowed");
      }
    },
    project: async (_, args, context) => {
      const oso = await initOso();
      context.user.requires.userProjects = await Project.fetchUserProjectIds(
        context.user.id
      );
      const result = await Project.fetchProject(args.projectId);
      if (await oso.isAllowed(context.user, "get:project", result)) {
        return result;
      } else {
        throw new ForbiddenError("Not allowed");
      }
    },
    projects: async (_, __, context) => {
      const oso = await initOso();
      context.user.requires.userProjects = await Project.fetchUserProjectIds(
        context.user.id
      );
      const results = await Project.fetchProjects();
      const authorizedResults = [];
      for (const result of results) {
        if (await oso.isAllowed(context.user, "get:project", result)) {
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
