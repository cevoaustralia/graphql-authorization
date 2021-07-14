const { ForbiddenError } = require("apollo-server");
const User = require("./models/user");
const Project = require("./models/project");

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      // clone context user as it may be overwritten
      const user = User.clone(context.user);
      if (await context.oso.isAllowed(user, "list:users", "_")) {
        return await User.fetchUsers();
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
      // clone context user as it may be overwritten
      const user = User.clone(context.user);
      if (await context.oso.isAllowed(user, "list:indicators", "_")) {
        let projectIds;
        if (user.isRequiredUserGroup()) {
          projectIds = [];
        } else {
          projectIds = user.filterAllowedProjectIds();
          if (projectIds.length == 0) {
            throw new Error("fails to pupulate project ids");
          }
        }
        return await Project.fetchProjectIndicators(projectIds);
      } else {
        throw new ForbiddenError(
          JSON.stringify({ requires: user.requires, groups: user.groups })
        );
      }
    },
  },
  Mutation: {
    updateProjectStatus: async (_, args, context) => {
      // clone context user as it may be overwritten
      const user = User.clone(context.user);
      if (
        await context.oso.isAllowed(
          user,
          "update:project",
          parseInt(args.projectId)
        )
      ) {
        return Project.updateProjectStatus(args.projectId, args.status);
      } else {
        throw new ForbiddenError(
          JSON.stringify({ requires: user.requires, groups: user.groups })
        );
      }
    },
  },
};

module.exports = resolvers;
