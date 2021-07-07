const { fetchUsers } = require("./utils");

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      console.log(context);
      return fetchUsers();
    },
  },
};

module.exports = resolvers;
