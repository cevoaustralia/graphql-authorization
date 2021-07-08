const { initOso } = require("./polars/loads");
const User = require("./models/user");

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      console.log(context);
      // initialize Oso
      const oso = await initOso();
      // update current user with required roles
      const currentUser = context.user;
      currentUser.context = context.requires;
      // build results
      const users = await User.fetchUsers();
      let results = [];
      for (const user of users) {
        if (await oso.isAllowed(currentUser, "users", user)) {
          results.push(user);
        }
      }
      return results;
    },
  },
};

module.exports = resolvers;
