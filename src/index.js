const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { RoleRequires } = require("./utils/directive");
const User = require("./models/user");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    requires: RoleRequires,
  },
  context: async ({ req }) => {
    const user = await User.initUser(req.headers.name);
    return {
      user: user,
    };
  },
});

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/sandbox
  `);
});
